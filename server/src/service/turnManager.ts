import { AnswerAccuracy, UserRole, UserTurn } from "@shared/scenarios/model.js";
import { Scenario } from "@src/model/scenarios.interface.js";
import OpenAILLMService from "./openaillmservice.js";
import LLMService from "./llmservice.interface.js";
import {
  AmbiguesWords,
  MessageMarkers,
  PhoneticAlphabet,
} from "@src/model/turnMessages.interface.js";
import CerebrasLLMService from "./cerebrasllmservice.js";

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
    console.log("Corrected user input: ", userText);

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
      answerAccuracy: messageFeedback.answerAccuracy,
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
        answerAccuracy: AnswerAccuracy.Incorrect,
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
  ): Promise<{ feedback: string; answerAccuracy: AnswerAccuracy }> {
    let errorCounter = 0;
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

    errorCounter = errorCounter + ((parsedOpening.errorCounter >= 2) ? 2 : parsedOpening.errorCounter)
    const { openingFeedback, messageWithoutOpening } = parsedOpening;

    const parseEndingMessage = this.controlEnding(
      messageWithoutOpening,
      turnMessage,
    );
    if(!parseEndingMessage.correct){
      errorCounter = errorCounter + 2;
    }

  
    let answerAccuracy = AnswerAccuracy.Correct;

    let feedback = openingFeedback + '\n' + parseEndingMessage.feedback;

    if (this.countWords(parseEndingMessage.remainingMessage) !== 0) {
      const turnMessageContent = this.getTurnAnswerContent(turnMessage);

      const contentFeedback = await this.controlContent(
        parseEndingMessage.remainingMessage,
        turnMessageContent,
      );

      feedback = feedback + '\n' + contentFeedback.feedback;

      errorCounter = errorCounter + contentFeedback.errorCounter;
    }

    if(errorCounter >= 4){
      answerAccuracy = AnswerAccuracy.Incorrect;
    } else if (errorCounter >= 2){
      answerAccuracy = AnswerAccuracy.PartiallyCorrect;
    }
    return { feedback: feedback, answerAccuracy: answerAccuracy};
  }

  private async controlContent(
    userInput: string,
    turnAnswer: string,
  ): Promise<{ feedback: string; errorCounter: number }> {
    const correctContent = await this.llmModel.compareMeaning(
      userInput,
      turnAnswer,
    );

    let feedback = "";
    let errorCounter = 0;

    if (correctContent) {
      feedback = "Content is correct. ";
    } else {
      feedback = "Content is missing information. ";
      errorCounter = errorCounter + 4;
    }

    const userWordCount = this.countWords(userInput);
    const turnWordCount = this.countWords(turnAnswer);

    // + 5 is just taken out of thin air
    if (userWordCount >= turnWordCount + 5) {
      feedback += "Content includes more words than needed. ";
      //TODO: Should this render an errorcounter or not?
    }

    const turnWords = this.getWords(turnAnswer);
    const userWords = this.getWords(userInput);

    // Check if the first word is a message marker and then to see if that is included in the user message.
    const turnFirstWord = turnWords[0];
    const turnFirstWordMarker = Object.values(MessageMarkers).includes(
      turnFirstWord as MessageMarkers,
    )
      ? (turnFirstWord as MessageMarkers)
      : null;

    const userMessageMarkers = this.findMatches(userWords, MessageMarkers);

    const userHasTurnMarker =
      turnFirstWordMarker !== null &&
      userMessageMarkers.includes(turnFirstWordMarker);

    const userHasAnyMarker = userMessageMarkers.length > 0;

    const userAmbiguousWords = this.findMatches(userWords, AmbiguesWords);

    const turnPhoneticWords = this.findMatches(turnWords, PhoneticAlphabet);
    const userPhoneticWords = this.findMatches(userWords, PhoneticAlphabet);

    const userPhoneticSet = new Set(userPhoneticWords);
    const userHasAllTurnPhonetics = turnPhoneticWords.every((w) =>
      userPhoneticSet.has(w),
    );

    if (userAmbiguousWords.length !== 0){
      feedback += "Ambiguous words used. ";
      errorCounter = errorCounter + 1;
    }

    if (turnFirstWordMarker && !userHasAnyMarker){
      feedback += "Missing message Marker. ";
      errorCounter = errorCounter + 1;
    }
    if (turnFirstWordMarker && userHasAnyMarker && !userHasTurnMarker){
      feedback += "Control that message marker is appropriate. ";
      errorCounter = errorCounter + 1;
    }

    if (!userHasAllTurnPhonetics){
      feedback += "Missing phonetic alphabet words from expected response. ";
      errorCounter = errorCounter + 4;
    }

    return { feedback: feedback, errorCounter: errorCounter };
  }

  private controlOpening(
    message: string,
    scenarioIndex: number,
  ): {
    messageWithoutOpening: string;
    correct: boolean;
    openingFeedback: string;
    errorCounter: number;
  } {
    const sender =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.starter.name
        : this.scenario.participants.responder.name;

    const receiver =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.responder.name
        : this.scenario.participants.starter.name;

    const includesReceiver = message.includes(receiver);
    const includesSender = message.includes(sender);

    let feedback = "";
    let correctOpening = false;
    let errorCounter = 0;


    if (!includesReceiver && !includesSender) {
      feedback = feedback + "Missing call signs in message. ";
      errorCounter = errorCounter + 2;
    } else if (!includesReceiver) {
      feedback = feedback + "Missing receiver call sign in message. ";
      errorCounter = errorCounter + 1;
    } else if (!includesSender) {
      feedback = feedback + "Missing sender call sign in message. ";
      errorCounter = errorCounter + 1;
    }

    const senderIndex = message.indexOf(sender);
    const receiverIndex = message.indexOf(receiver);

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
        errorCounter: errorCounter,
      };

    const correctOrder = senderIndex > receiverIndex;

    if (!correctOrder) {
      feedback = "Call signs in wrong order. ";
      errorCounter = errorCounter + 1;
    }

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
      errorCounter = errorCounter + 1;
    } else if (!isFirstMessage && matchReceiver.length !== 1) {
      feedback = feedback + "Message should contain the receiver once. ";
      errorCounter = errorCounter + 1;
    }

    if (!opening.includes("this is")){
      feedback = feedback + "Opening should contain this is. ";
      errorCounter = errorCounter + 1;
    }

    const wordsInOpening = this.countWords(opening);
    const shouldContainWords =
      this.countWords(sender) +
      this.countWords(receiver) * matchReceiver.length +
      2; // +2 is for "this is"

    if (wordsInOpening > shouldContainWords){
      feedback = feedback + "Opening contains more words than needed. ";
      errorCounter = errorCounter + 1;
    }

    if (feedback === "") {
      feedback = "Correct opening! ";
      correctOpening = true;
    }

    //TODO remove, just for testing
    console.log("Message: ", message);
    console.log("Opening: ", opening);
    console.log("Remaining message: ", remainingMessage);

    return {
      messageWithoutOpening: remainingMessage,
      correct: correctOpening,
      openingFeedback: feedback,
      errorCounter: errorCounter,
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

  private getWords(text: string): string[] {
    return text.match(/\b\w+\b/g)?.map((w) => w) ?? [];
  }

  private countWords(text: string): number {
    return this.getWords(text).length;
  }

  private findMatches<T extends string>(
    words: string[],
    enumObj: Record<string, T>,
  ): T[] {
    const validValues = new Set(Object.values(enumObj));
    return words.filter((w): w is T => validValues.has(w as T));
  }
}
