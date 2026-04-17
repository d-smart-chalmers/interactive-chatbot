import { UserRole, UserTurn } from "@shared/scenarios/model";
import { Scenario } from "@src/model/scenarios.interface";
import OpenAILLMService from "./openaillmservice";
import LLMService from "./llmservice.interface";

export class TurnManager {
  private feedbackPromises: Map<number, Promise<UserTurn>>;
  private userRole: UserRole;
  private scenario: Scenario;
  private llmModel: LLMService;

  constructor(scenario: Scenario, userRole: UserRole) {
    this.scenario = scenario;
    this.userRole = userRole;
    this.feedbackPromises = new Map();
    this.llmModel = new OpenAILLMService();
  }

  async startGenerateFeedback(
    userTurn: UserTurn,
    scenarioIndex: number,
  ): Promise<void> {
    // Supposed to avoid duplicate calls to llm.
    if (this.feedbackPromises.has(userTurn.id)) {
      return;
    }

    const promise = this.generateFeedback(userTurn, scenarioIndex);

    promise.catch(() => {
      this.feedbackPromises.delete(userTurn.id);
    });

    this.feedbackPromises.set(userTurn.id, promise);
  }

  private async generateFeedback(
    userTurn: UserTurn,
    scenarioIndex: number,
  ): Promise<UserTurn> {
    const userText = await this.llmModel.correctSpelling(userTurn.message);

    let turnAnswer: string | undefined;

    if (this.userRole === UserRole.VTS) {
      turnAnswer = this.scenario.scenarioTurns[scenarioIndex]?.vtsMessage;
    } else {
      turnAnswer = this.scenario.scenarioTurns[scenarioIndex]?.vesselMessage;
    }

    if (turnAnswer === undefined) turnAnswer = "Failed to find turn message";

    let messageFeedback = await this.controlUserMessage(
      userTurn.message,
      userText,
      turnAnswer,
      scenarioIndex,
    );

    // TODO: remove later, just used for testing
    let testFeedback =
      messageFeedback.feedback + " and turn answer: " + turnAnswer;

    const updatedTurn: UserTurn = {
      ...userTurn,
      feedback: testFeedback,
      correct: messageFeedback.correct,
    };

    return updatedTurn;
  }

  async waitForFeedback(userTurnId: number): Promise<UserTurn> {
    const feedbackPromise = this.feedbackPromises.get(userTurnId);

    if (!feedbackPromise) {
      console.log("Feedback promise missing for turn:", userTurnId);

      return {
        id: userTurnId,
        message: "Please send again, error in backend",
        feedback: "Fallback feedback generated in waitForFeedback",
        correct: false,
        timestamp: Date.now(),
      } as UserTurn;
    }

    const updatedTurn = await feedbackPromise;

    this.feedbackPromises.delete(userTurnId);

    return updatedTurn;
  }

  private async controlUserMessage(
    userInput: string,
    correctedUserInput: string,
    turnAnswer: string,
    scenarioIndex: number,
  ): Promise<{ feedback: string; correct: boolean }> {
    const userMessage = this.normalize(userInput);
    const correctedUserMessage = this.normalize(correctedUserInput);
    const turnMessage = this.normalize(turnAnswer);

    const parsedCorrected = this.controlOpening(
      correctedUserMessage,
      scenarioIndex,
    );
    // Fallback in case spell check breaks call signs
    const parsedOriginal = this.controlOpening(userMessage, scenarioIndex);

    const parsedOpening =
      parsedCorrected.correct || !parsedOriginal.correct
        ? parsedCorrected
        : parsedOriginal;

    const { openingFeedback, messageWithoutOpening } = parsedOpening;

    const parseEndingMessage = this.controlEnding(
      messageWithoutOpening,
      turnMessage,
    );

    let correct = true;

    let feedback = openingFeedback + parseEndingMessage.feedback;

    if (this.countWords(parseEndingMessage.remainingMessage) !== 0) {
      const turnMessageContent = this.getTurnAnswerContent(turnMessage);

      const contentFeedback = await this.compareTexts(
        parseEndingMessage.remainingMessage,
        turnMessageContent,
      );

      feedback = feedback + contentFeedback.feedback;
      correct = contentFeedback.correct;
    }

    return { feedback: feedback, correct: correct };
  }

  private async compareTexts(
    userInput: string,
    turnAnswer: string,
  ): Promise<{ feedback: string; correct: boolean }> {
    const correctContent = await this.llmModel.compareMeaning(
      userInput,
      turnAnswer,
    );

    let feedback = "";

    if (correctContent) {
      feedback = "Content is correct. ";
    } else {
      feedback = "Content is missing information. ";
    }

    const userInputWords = this.countWords(userInput);
    const turnAnswerWords = this.countWords(turnAnswer);

    if (userInputWords > turnAnswerWords + 5) {
      feedback = feedback + "Content includes more words than needed. ";
    }

    return { feedback: feedback, correct: correctContent };
  }

  private controlOpening(
    message: string,
    scenarioIndex: number,
  ): {
    messageWithoutOpening: string;
    correct: boolean;
    openingFeedback: string;
  } {
    const sender =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.starter.name.toLowerCase()
        : this.scenario.participants.responder.name.toLowerCase();

    const receiver =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.responder.name.toLowerCase()
        : this.scenario.participants.starter.name.toLowerCase();

    const includesReceiver = message.includes(receiver);
    const includesSender = message.includes(sender);

    let feedback = "";
    let correctOpening = false;

    if (!includesReceiver && !includesSender) {
      feedback = feedback + "Missing call signs in message. ";
    } else if (!includesReceiver) {
      feedback = feedback + "Missing receiver call sign in message. ";
    } else if (!includesSender) {
      feedback = feedback + "Missing sender call sign in message. ";
    }

    const senderIndex = message.indexOf(sender.toLowerCase());
    const receiverIndex = message.indexOf(receiver.toLowerCase());

    const endIndex =
      senderIndex === -1 && receiverIndex === -1
        ? 0
        : Math.max(
            senderIndex + sender.length,
            receiverIndex + receiver.length,
          );

    const opening = message.slice(0, endIndex).trim();
    const remainingMessage = message
      .slice(endIndex)
      .replace(/^[\s.]+/, "")
      .trim();

    const matchReceiver = opening.match(new RegExp(receiver, "gi"));

    // Checking matchReceiver instead of includesReceiver for null check
    if (matchReceiver === null || !includesSender)
      return {
        messageWithoutOpening: remainingMessage,
        correct: correctOpening,
        openingFeedback: feedback,
      };

    const correctOrder = senderIndex > receiverIndex;

    if (!correctOrder) feedback = "Callsigns in wrong order. ";

    const isFirstMessage =
      scenarioIndex === 0 &&
      this.userRole === this.scenario.participants.starter.role;

    if (
      isFirstMessage &&
      (matchReceiver.length < 2 || matchReceiver.length > 3)
    ) {
      feedback =
        feedback +
        "First message should contain the receiver two or three times. ";
    } else if (!isFirstMessage && matchReceiver.length !== 1) {
      feedback = feedback + "Message should contain the receiver once. ";
    }

    if (!opening.includes("this is"))
      feedback = feedback + "Opening should contain this is. ";

    const wordsInOpening = this.countWords(opening);
    const shouldContainWords =
      this.countWords(sender) +
      this.countWords(receiver) * matchReceiver.length +
      2; // +2 is for "this is"

    if (wordsInOpening > shouldContainWords)
      feedback = feedback + "Opening consists of more words than needed. ";

    if (feedback === "") {
      feedback = "Correct opening! ";
      correctOpening = true;
    }

    //TODO remove, just for testing
    console.log("Message: ", message);
    console.log("Opening: ", opening);
    console.log("Remaining message: ", remainingMessage);
    console.log("Feedback: ", feedback);
    console.log("Words in opening: ", wordsInOpening);
    console.log("Opening should contain this many words: ", shouldContainWords);
    console.log("Correct opening? ", correctOpening);

    return {
      messageWithoutOpening: remainingMessage,
      correct: correctOpening,
      openingFeedback: feedback,
    };
  }

  private controlEnding(
    message: string,
    turnAnswer: string,
  ): {
    remainingMessage: string;
    correct: boolean;
    feedback: string;
  } {
    const correctEnding = turnAnswer.match(/\b(over|out)\b\.?\s*$/i);
    const match = message.match(/\b(over and out|over|out)\b\.?\s*$/i);

    let feedback = "";
    let correct = false;

    // correctEnding should never be null
    if (match === null || correctEnding === null) {
      return {
        remainingMessage: message,
        correct: correct,
        feedback: "Message is missing ending. ",
      };
    }

    if (correctEnding[1] === match[1]) {
      feedback = "Ending is correct. ";
      correct = true;
    } else {
      feedback = "Incorrect ending of message. ";
    }

    const remaining = message.slice(0, match.index).trim();

    return {
      remainingMessage: remaining,
      correct: correct,
      feedback: feedback,
    };
  }

  private getTurnAnswerContent(message: string): string {
    const sender =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.starter.name.toLowerCase()
        : this.scenario.participants.responder.name.toLowerCase();

    const indexSender = message.indexOf(sender);

    if (indexSender === -1) return message;

    let remainingMessage = message.slice(indexSender + sender.length).trim();

    remainingMessage = remainingMessage
      .replace(/\s*\b(over|out)\b\.?\s*$/i, "")
      .trim();

    return remainingMessage;
  }

  private normalize(message: string): string {
    return message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip diacritics
      .replace(/[^\w\s]/g, "") // remove punctuation (including dots)
      .replace(/\s+/g, " ") // collapse multiple spaces
      .trim();
  }

  private countWords(text: string): number {
    const words = text.match(/\b\w+\b/g);

    return words ? words.length : 0;
  }
}
