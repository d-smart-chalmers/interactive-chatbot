import { AnswerAccuracy, UserRole, UserTurn } from "@shared/scenarios/model.js";
import { Scenario } from "@src/model/scenarios.interface.js";
import OpenAILLMService from "./openaillmservice.js";
import LLMService from "./llmservice.interface.js";
import {
  AmbiguesWords,
  MaritimeMessage,
  MessageEnding,
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
  private parseMessage(message: string): {
    opening?: string;
    content?: string;
    ending?: string;
  } {
    const sender = this.getSender();
    const receiver = this.getReceiver();
    const endings = Object.values(MessageEnding).join("|");

    // --- Opening ---
    const senderLastIndex = message.lastIndexOf(sender);
    const receiverLastIndex = message.lastIndexOf(receiver);

    const endIndex =
      senderLastIndex === -1 && receiverLastIndex === -1
        ? 0
        : Math.max(
            senderLastIndex !== -1 ? senderLastIndex + sender.length : 0,
            receiverLastIndex !== -1 ? receiverLastIndex + receiver.length : 0,
          );

    const opening = message.slice(0, endIndex).trim();
    const afterOpening = message
      .slice(endIndex)
      .replace(/^[\s.]+/, "")
      .trim();

    // --- Ending ---
    const endingMatch = afterOpening.match(
      new RegExp(`\\b(over and out|${endings})\\b\\.?\\s*$`, "i"),
    );
    const ending = endingMatch ? endingMatch[1] : "";
    const content = endingMatch
      ? afterOpening.slice(0, endingMatch.index).trim()
      : afterOpening;

    return { opening, content, ending };
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
    const turnAmbiguousWords = this.findMatches(turnWords, AmbiguesWords);
    const notAcceptedUserAmbiguousWords = userAmbiguousWords.filter(
      (word) => !turnAmbiguousWords.includes(word),
    );

    const turnPhoneticWords = this.findMatches(turnWords, PhoneticAlphabet);
    const userPhoneticWords = new Set(
      this.findMatches(userWords, PhoneticAlphabet),
    );

    if (notAcceptedUserAmbiguousWords.length > 0) {
      feedbackParts.push(
        "Avoid using ambiguous words: " +
          notAcceptedUserAmbiguousWords.map((w) => `'${w}'`).join(", ") +
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

  private async controlUserMessage(
    userInput: string,
    correctedUserInput: string,
    turnAnswer: string,
  ): Promise<{ feedback: string; answerAccuracy: AnswerAccuracy }> {
    const userMessage = this.normalize(userInput);
    const correctedUserMessage = this.normalize(correctedUserInput);
    const turnMessage = this.normalize(turnAnswer);

    const turnParsed: MaritimeMessage = this.parseMessage(turnMessage);
    const userParsed: MaritimeMessage = this.parseMessage(userMessage);
    const correctedParsed: MaritimeMessage =
      this.parseMessage(correctedUserMessage);

    const originalOpening = this.controlOpening(
      userParsed.opening ?? "",
      turnParsed.opening ?? "",
    );
    const correctedOpening = this.controlOpening(
      correctedParsed.opening ?? "",
      turnParsed.opening ?? "",
    );

    // Prefer corrected unless original is better (spell check may break call signs)
    const parsed =
      correctedOpening.correct || !originalOpening.correct
        ? correctedParsed
        : userParsed;

    let errorCounter = 0;
    const feedbackParts: string[] = [];

    const openingResult =
      correctedOpening.correct || !originalOpening.correct
        ? correctedOpening
        : originalOpening;
    errorCounter += Math.min(openingResult.errorCounter, 2);
    feedbackParts.push(openingResult.feedback);

    const endingResult = this.controlEnding(
      parsed.ending ?? "",
      turnParsed.ending ?? "",
    );
    if (!endingResult.correct) errorCounter += 2;
    feedbackParts.push(endingResult.feedback);

    if (
      this.countWords(parsed.content ?? "") > 0 &&
      turnParsed.content?.trim()
    ) {
      const contentResult = await this.controlContent(
        parsed.content ?? "",
        turnParsed.content,
      );
      feedbackParts.splice(1, 0, contentResult.feedback);
      errorCounter += contentResult.errorCounter;
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

  private controlOpening(
    opening: string,
    turnOpening: string,
  ): {
    feedback: string;
    correct: boolean;
    errorCounter: number;
  } {
    const sender = this.getSender();
    const receiver = this.getReceiver();
    const feedbackParts: string[] = [];
    let errorCounter = 0;

    const includesReceiver = opening.includes(receiver);
    const includesSender = opening.includes(sender);

    if (!includesReceiver && !includesSender) {
      feedbackParts.push("Missing names in message.");
      errorCounter += 2;
    } else if (!includesReceiver) {
      feedbackParts.push("Missing receiver name in opening.");
      errorCounter += 1;
    } else if (!includesSender) {
      feedbackParts.push("Missing sender name in opening.");
      errorCounter += 1;
    }

    const senderIndex = opening.indexOf(sender);
    const receiverIndex = opening.indexOf(receiver);

    const matchReceiver = opening.match(new RegExp(receiver, "gi"));
    const matchSender = opening.match(new RegExp(sender, "gi"));

    if (!matchReceiver || !matchSender) {
      return {
        feedback: feedbackParts.join(" "),
        correct: false,
        errorCounter,
      };
    }

    if (senderIndex <= receiverIndex) {
      feedbackParts.push("Sender and receiver are in wrong order.");
      errorCounter += 1;
    }

    const receiverCountInAnswer = (
      turnOpening.match(new RegExp(receiver, "gi")) ?? []
    ).length;
    const senderCountInAnswer = (
      turnOpening.match(new RegExp(sender, "gi")) ?? []
    ).length;
    const shouldIncludeMulReceiver = receiverCountInAnswer >= 2;
    const shouldIncludeMulSender = senderCountInAnswer >= 3;

    if (
      shouldIncludeMulReceiver &&
      (matchReceiver.length < 2 || matchReceiver.length > 3)
    ) {
      feedbackParts.push(
        "First message should contain the receiver two or three times.",
      );
      errorCounter += 1;
    } else if (!shouldIncludeMulReceiver && matchReceiver.length !== 1) {
      feedbackParts.push("Message should contain the receiver once.");
      errorCounter += 1;
    }

    if (shouldIncludeMulSender && matchSender.length !== 3) {
      feedbackParts.push(
        "First message should contain the sender three times.",
      );
      errorCounter += 1;
    } else if (!shouldIncludeMulSender && matchSender.length !== 1) {
      feedbackParts.push("Message should contain the sender once.");
      errorCounter += 1;
    }

    if (!opening.includes("this is") && includesSender) {
      feedbackParts.push("It's recommended to use 'this is' in the opening.");
    }

    const expectedWordCount =
      this.countWords(sender) +
      this.countWords(receiver) * matchReceiver.length +
      2;
    if (this.countWords(opening) > expectedWordCount + EXTRA_WORD_THRESHOLD) {
      feedbackParts.push("Opening contains more words than needed.");
      errorCounter += 1;
    }

    const correct = feedbackParts.length === 0;
    if (correct) feedbackParts.push("Correct opening.");

    return { feedback: feedbackParts.join(" "), correct, errorCounter };
  }

  private controlEnding(
    ending: string,
    turnEnding: string,
  ): {
    correct: boolean;
    feedback: string;
  } {
    if (!ending) {
      return {
        correct: false,
        feedback: `Message should end with '${turnEnding}'.`,
      };
    }

    const correct = ending === turnEnding;
    return {
      correct,
      feedback: correct
        ? "Ending is correct."
        : `Message should end with '${turnEnding}'.`,
    };
  }

  private normalize(message: string): string {
    return message
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\badvise\b/g, "advice")
      .replace(/\bstandby\b/g, "stand by")
      .replace(/\balfa\b/g, "alpha")
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
