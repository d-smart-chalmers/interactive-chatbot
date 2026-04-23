import { AnswerAccuracy, UserRole, UserTurn } from "@shared/scenarios/model.js";
import { Scenario } from "@src/model/scenarios.interface.js";
import OpenAILLMService from "./openaillmservice.js";
import LLMService from "./llmservice.interface.js";
import {
  AmbiguesWords,
  MessageMarkers,
  PhoneticAlphabet,
} from "@src/model/turnMessages.interface.js";

const EXTRA_WORD_THRESHOLD = 5;

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
    if (this.feedbackPromises.has(userTurn.id)) return;

    const promise = this.generateFeedback(userTurn, scenarioIndex);
    promise.catch(() => this.feedbackPromises.delete(userTurn.id));
    this.feedbackPromises.set(userTurn.id, promise);
  }

  async waitForFeedback(userTurnId: number): Promise<UserTurn> {
    const feedbackPromise = this.feedbackPromises.get(userTurnId);

    if (!feedbackPromise) {
      console.warn("Feedback promise missing for turn:", userTurnId);
      return this.fallbackTurn(userTurnId);
    }

    const updatedTurn = await feedbackPromise;
    this.feedbackPromises.delete(userTurnId);
    return updatedTurn;
  }

  private async generateFeedback(
    userTurn: UserTurn,
    scenarioIndex: number,
  ): Promise<UserTurn> {
    const correctedMessage = await this.llmModel.correctSpelling(
      userTurn.message,
    );

    const turnAnswer =
      this.getTurnAnswer(scenarioIndex) ?? "Failed to find turn message";
    const { feedback, answerAccuracy } = await this.controlUserMessage(
      userTurn.message,
      correctedMessage,
      turnAnswer,
      scenarioIndex,
    );

    return { ...userTurn, feedback, answerAccuracy };
  }

  private getTurnAnswer(scenarioIndex: number): string | undefined {
    const turn = this.scenario.scenarioTurns[scenarioIndex];
    return this.userRole === UserRole.VTS
      ? turn?.vtsMessage
      : turn?.vesselMessage;
  }

  private getSender(): string {
    return this.userRole === this.scenario.participants.starter.role
      ? this.scenario.participants.starter.name
      : this.scenario.participants.responder.name;
  }

  private getReceiver(): string {
    return this.userRole === this.scenario.participants.starter.role
      ? this.scenario.participants.responder.name
      : this.scenario.participants.starter.name;
  }

  private fallbackTurn(userTurnId: number): UserTurn {
    return {
      id: userTurnId,
      message: "Please send again, error in backend",
      feedback: "Fallback feedback generated in waitForFeedback",
      answerAccuracy: AnswerAccuracy.Incorrect,
      timestamp: Date.now(),
    } as UserTurn;
  }

  private async controlUserMessage(
    userInput: string,
    correctedUserInput: string,
    turnAnswer: string,
    scenarioIndex: number,
  ): Promise<{ feedback: string; answerAccuracy: AnswerAccuracy }> {
    const userMessage = this.normalize(userInput);
    const correctedUserMessage = this.normalize(correctedUserInput);
    const turnMessage = this.normalize(turnAnswer);

    const parsedCorrected = this.controlOpening(
      correctedUserMessage,
      scenarioIndex,
    );
    const parsedOriginal = this.controlOpening(userMessage, scenarioIndex);

    // Prefer corrected unless original is better (spell check may break call signs)
    const parsedOpening =
      parsedCorrected.correct || !parsedOriginal.correct
        ? parsedCorrected
        : parsedOriginal;

    let errorCounter = Math.min(parsedOpening.errorCounter, 2);

    const endingResult = this.controlEnding(
      parsedOpening.messageWithoutOpening,
      turnMessage,
    );
    if (!endingResult.correct) errorCounter += 2;

    const feedbackParts = [
      parsedOpening.openingFeedback,
      endingResult.feedback,
    ];

    if (this.countWords(endingResult.remainingMessage) > 0) {
      const turnContent = this.getTurnAnswerContent(turnMessage);
      if (turnContent.trim()) {
        const contentResult = await this.controlContent(
          endingResult.remainingMessage,
          turnContent,
        );
        feedbackParts.splice(1, 0, contentResult.feedback); 
        errorCounter += contentResult.errorCounter;
      }
    }

    const feedback = feedbackParts.join("\n");
    const answerAccuracy =
      errorCounter >= 4
        ? AnswerAccuracy.Incorrect
        : errorCounter > 0
          ? AnswerAccuracy.PartiallyCorrect
          : AnswerAccuracy.Correct;

    return { feedback, answerAccuracy };
  }

  private async controlContent(
    userInput: string,
    turnAnswer: string,
  ): Promise<{ feedback: string; errorCounter: number }> {
    const feedbackParts: string[] = [];
    let errorCounter = 0;

    const correctContent = await this.llmModel.compareMeaning(
      userInput,
      turnAnswer,
    );
    if (correctContent) {
      feedbackParts.push("Content is correct.");
    } else {
      feedbackParts.push("Content is missing information.");
      errorCounter += 4;
    }

    const userWordCount = this.countWords(userInput);
    const turnWordCount = this.countWords(turnAnswer);
    if (userWordCount >= turnWordCount + EXTRA_WORD_THRESHOLD) {
      feedbackParts.push("Content includes more words than needed.");
    }

    const turnWords = this.getWords(turnAnswer);
    const userWords = this.getWords(userInput);

    const turnFirstWord = turnWords[0];
    const turnMarker = Object.values(MessageMarkers).includes(
      turnFirstWord as MessageMarkers,
    )
      ? (turnFirstWord as MessageMarkers)
      : null;

    const userMarkers = this.findMatches(userWords, MessageMarkers);
    const userAmbiguousWords = this.findMatches(userWords, AmbiguesWords);
    const turnPhoneticWords = this.findMatches(turnWords, PhoneticAlphabet);
    const userPhoneticWords = new Set(
      this.findMatches(userWords, PhoneticAlphabet),
    );

    if (userAmbiguousWords.length > 0) {
      feedbackParts.push(
        "Avoid using ambiguous words: " +
          userAmbiguousWords.map((w) => `'${w}'`).join(", ") +
          ".",
      );
      errorCounter += 1;
    }

    if (turnMarker && userMarkers.length === 0) {
      feedbackParts.push("Message marker is missing.");
      errorCounter += 1;
    } else if (turnMarker && !userMarkers.includes(turnMarker)) {
      feedbackParts.push("Control that message marker is appropriate.");
      errorCounter += 1;
    }

    if (!turnPhoneticWords.every((w) => userPhoneticWords.has(w))) {
      feedbackParts.push(
        "Missing phonetic alphabet words from expected response.",
      );
      errorCounter += 4;
    }

    return { feedback: feedbackParts.join(" "), errorCounter };
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
    const sender = this.getSender();
    const receiver = this.getReceiver();

    const feedbackParts: string[] = [];
    let errorCounter = 0;

    const includesReceiver = message.includes(receiver);
    const includesSender = message.includes(sender);

    if (!includesReceiver && !includesSender) {
      feedbackParts.push("Missing call signs in message.");
      errorCounter += 2;
    } else if (!includesReceiver) {
      feedbackParts.push("Missing receiver call sign in message.");
      errorCounter += 1;
    } else if (!includesSender) {
      feedbackParts.push("Missing sender call sign in message.");
      errorCounter += 1;
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
    if (!matchReceiver || !includesSender) {
      return {
        messageWithoutOpening: remainingMessage,
        correct: false,
        openingFeedback: feedbackParts.join(" "),
        errorCounter,
      };
    }

    if (senderIndex <= receiverIndex) {
      feedbackParts.push("Call signs in wrong order.");
      errorCounter += 1;
    }

    const isFirstMessage =
      scenarioIndex === 0 &&
      this.userRole === this.scenario.participants.starter.role;

    if (
      isFirstMessage &&
      (matchReceiver.length < 2 || matchReceiver.length > 3)
    ) {
      feedbackParts.push(
        "First message should contain the receiver two or three times.",
      );
      errorCounter += 1;
    } else if (!isFirstMessage && matchReceiver.length !== 1) {
      feedbackParts.push("Message should contain the receiver once.");
      errorCounter += 1;
    }

    if (!opening.includes("this is")) {
      feedbackParts.push("Opening should contain 'this is'.");
      errorCounter += 1;
    }

    const expectedWordCount =
      this.countWords(sender) +
      this.countWords(receiver) * matchReceiver.length +
      2;
    if (this.countWords(opening) > expectedWordCount) {
      feedbackParts.push("Opening contains more words than needed.");
      errorCounter += 1;
    }

    const correct = feedbackParts.length === 0;
    if (correct) feedbackParts.push("Correct opening!");

    return {
      messageWithoutOpening: remainingMessage,
      correct,
      openingFeedback: feedbackParts.join(" "),
      errorCounter,
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

    if (!match || !correctEnding) {
      return {
        remainingMessage: message,
        correct: false,
        feedback: "Message is missing ending.",
      };
    }

    const correct = correctEnding[1] === match[1];
    return {
      remainingMessage: message.slice(0, match.index).trim(),
      correct,
      feedback: correct ? "Ending is correct." : "Incorrect ending of message.",
    };
  }

  private getTurnAnswerContent(message: string): string {
    const sender = this.getSender().toLowerCase();
    const senderIndex = message.indexOf(sender);
    if (senderIndex === -1) return message;

    return message
      .slice(senderIndex + sender.length)
      .trim()
      .replace(/\s*\b(over|out)\b\.?\s*$/i, "")
      .trim();
  }

  private normalize(message: string): string {
    return message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
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
