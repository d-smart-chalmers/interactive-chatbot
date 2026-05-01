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
const INCORRECT_ERRORS_THRESHOLD = 4;

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
    const turnAnswer = this.getTurnAnswer(scenarioIndex);

    if (!turnAnswer) {
      return this.fallbackTurn(userTurn.id);
    }

    const { feedback, answerAccuracy } = await this.controlUserMessage(
      userTurn.message,
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

  private fallbackTurn(userTurnId: number): UserTurn {
    return {
      id: userTurnId,
      message: "Please send again, error in backend",
      feedback: "Generated fallback feedback",
      answerAccuracy: AnswerAccuracy.Incorrect,
      timestamp: Date.now(),
    } as UserTurn;
  }

  private async controlUserMessage(
    userInput: string,
    turnAnswer: string,
  ): Promise<{ feedback: string; answerAccuracy: AnswerAccuracy }> {
    const userMessage = this.normalize(userInput);
    const turnMessage = this.normalize(turnAnswer);

    const initiateContact = this.checkInitiateContact(turnMessage);

    const turnParsed = this.parseMessage(turnMessage, initiateContact);
    const userParsed = this.parseMessage(userMessage, initiateContact);

    const originalOpening = this.controlOpening(
      userParsed.opening,
      initiateContact,
    );

    const originalEnding = this.controlEnding(
      userParsed.ending,
      turnParsed.ending,
    );

    const userHasContent = this.countWords(userParsed.content) > 0;
    const turnHasContent = this.countWords(turnParsed.content) > 0;

    const needSpellCheck =
      !originalOpening.correct ||
      !originalEnding.correct ||
      (userHasContent && turnHasContent);

    // If no spell check needed, we use the raw input and return feedback
    // (this avoids using the llm service when not needed to save costs and time).
    const correctedUserInput = needSpellCheck
      ? await this.correctSpellingWithFallback(userInput)
      : userInput;

    const correctedUserMessage = this.normalize(correctedUserInput);
    const correctedParsed = this.parseMessage(
      correctedUserMessage,
      initiateContact,
    );

    // If original opening is determined correct, we use it. Otherwise we control the corrected opening.
    const correctedOpening = !originalOpening.correct
      ? this.controlOpening(correctedParsed.opening, initiateContact)
      : originalOpening;

    // If original ending is determined correct, we use it. Otherwise we control the corrected ending.
    const correctedEnding = !originalEnding.correct
      ? this.controlEnding(correctedParsed.ending, turnParsed.ending)
      : originalEnding;

    let errorCounter = 0;

    errorCounter += Math.min(correctedOpening.errorCounter, 2);

    if (!correctedEnding.correct) errorCounter += 2;

    const feedbackLines = [
      ...correctedOpening.feedbackLines,
      correctedEnding.feedback,
    ];

    if (userHasContent || turnHasContent) {
      const contentResult = await this.controlContent(
        correctedParsed.content,
        turnParsed.content,
      );
      feedbackLines.splice(
        correctedOpening.feedbackLines.length,
        0,
        ...contentResult.feedbackLines,
      );
      errorCounter += contentResult.errorCounter;
    }

    const feedback = feedbackLines.join("\n");
    const answerAccuracy =
      errorCounter >= INCORRECT_ERRORS_THRESHOLD
        ? AnswerAccuracy.Incorrect
        : errorCounter > 0
          ? AnswerAccuracy.PartiallyCorrect
          : AnswerAccuracy.Correct;

    return { feedback, answerAccuracy };
  }

  private parseMessage(
    message: string,
    initiateContact: boolean,
  ): MaritimeMessage {
    const sender = this.getSender();
    const receiver = this.getReceiver();
    const endings = Object.values(MessageEnding).join("|");

    const senderIndex = initiateContact
      ? message.lastIndexOf(sender)
      : message.indexOf(sender);

    const receiverIndex = initiateContact
      ? message.lastIndexOf(receiver)
      : message.indexOf(receiver);

    const senderEnd = senderIndex !== -1 ? senderIndex + sender.length : 0;
    const receiverEnd =
      receiverIndex !== -1 ? receiverIndex + receiver.length : 0;

    //Finds the index of the first message marker in the message, otherwise infinity
    const markerPattern = Object.values(MessageMarkers).join("|");
    const markerMatch = message.match(new RegExp(`\\b(${markerPattern})\\b`));
    const markerIndex = markerMatch?.index ?? Infinity;

    //Limits the opening to not include any message markers
    //i.e. guards against missing sender in opening but uses it later in message
    const endIndex = Math.min(Math.max(senderEnd, receiverEnd), markerIndex);

    const opening = message.slice(0, endIndex).trim();

    const afterOpening = message.slice(endIndex).trim();

    const endingMatch = afterOpening.match(
      new RegExp(`(over and out|${endings})\\s*$`),
    );

    let content: string;
    let ending: string | undefined;

    if (endingMatch) {
      ending = endingMatch[1];
      content = afterOpening.slice(0, endingMatch.index).trim();
    } else {
      content = afterOpening;
    }

    return { opening, content, ending: ending ?? "" };
  }

  private controlOpening(
    opening: string,
    initiateContact: boolean,
  ): {
    feedbackLines: string[];
    correct: boolean;
    errorCounter: number;
  } {
    const sender = this.getSender();
    const receiver = this.getReceiver();
    const feedbackLines: string[] = [];
    let errorCounter = 0;

    const includesReceiver = opening.includes(receiver);
    const includesSender = opening.includes(sender);

    if (!includesReceiver && !includesSender) {
      feedbackLines.push("Missing names in message.");
      errorCounter += 2;
    } else if (!includesReceiver) {
      feedbackLines.push("Missing receiver name in opening.");
      errorCounter += 1;
    } else if (!includesSender) {
      feedbackLines.push("Missing sender name in opening.");
      errorCounter += 1;
    }

    const matchReceiver = opening.match(new RegExp(receiver, "g"));
    const matchSender = opening.match(new RegExp(sender, "g"));

    // Enables a null check here for matches
    if (!matchReceiver || !matchSender) {
      return {
        feedbackLines: feedbackLines,
        correct: false,
        errorCounter,
      };
    }

    const senderIndex = opening.indexOf(sender);
    const receiverIndex = opening.indexOf(receiver);

    if (senderIndex < receiverIndex) {
      feedbackLines.push("Sender and receiver are in wrong order.");
      errorCounter += 1;
    }

    if (initiateContact) {
      if (matchReceiver.length < 2 || matchReceiver.length > 3) {
        feedbackLines.push(
          "First message should contain the receiver two or three times.",
        );
        errorCounter += 1;
      }

      if (matchSender.length !== 3) {
        feedbackLines.push(
          "First message should contain the sender three times.",
        );
        errorCounter += 1;
      }
    } else {
      if (matchReceiver.length !== 1) {
        feedbackLines.push("Message should contain the receiver once.");
        errorCounter += 1;
      }

      if (matchSender.length !== 1) {
        feedbackLines.push("Message should contain the sender once.");
        errorCounter += 1;
      }
    }

    if (!opening.includes("this is") && includesSender) {
      feedbackLines.push("It's recommended to use 'this is' in the opening.");
    }

    const expectedWordCount =
      this.countWords(sender) +
      this.countWords(receiver) * matchReceiver.length +
      2;

    if (this.countWords(opening) > expectedWordCount + EXTRA_WORD_THRESHOLD) {
      feedbackLines.push("Opening contains more words than needed.");
      errorCounter += 1;
    }

    const correct = feedbackLines.length === 0;

    if (correct) feedbackLines.push("Correct opening.");

    return { feedbackLines: feedbackLines, correct, errorCounter };
  }

  private async controlContent(
    userInput: string,
    turnAnswer: string,
  ): Promise<{ feedbackLines: string[]; errorCounter: number }> {
    const feedbackLines: string[] = [];
    let errorCounter = 0;

    const userWordCount = this.countWords(userInput);
    const turnWordCount = this.countWords(turnAnswer);

    if (turnWordCount > 0) {
      const correctContent =
        userWordCount > 0
          ? await this.compareMeaningWithFallback(userInput, turnAnswer)
          : false;

      if (correctContent === null) {
        feedbackLines.push("Content could not be verified.");
      } else if (correctContent) {
        feedbackLines.push("Content is correct.");
      } else {
        feedbackLines.push("Content is missing information.");
        errorCounter += 4;
      }

      if (userWordCount >= turnWordCount + EXTRA_WORD_THRESHOLD) {
        feedbackLines.push("Content includes more words than necessary.");
      }
    } else {
      //In case turnContent has 0 words but userContent has
      feedbackLines.push("Message includes more words than necessary.");
      errorCounter += 1;
    }

    const userWords = this.getWords(userInput);
    const turnWords = this.getWords(turnAnswer);

    const turnFirstWord = turnWords[0];

    const userMarkers = this.findMatches(userWords, MessageMarkers);
    const turnMarker = Object.values(MessageMarkers).includes(
      turnFirstWord as MessageMarkers,
    )
      ? (turnFirstWord as MessageMarkers)
      : null;

    if (turnMarker && userMarkers.length === 0) {
      feedbackLines.push("Message marker is missing.");
      errorCounter += 1;
    } else if (turnMarker && !userMarkers.includes(turnMarker)) {
      feedbackLines.push("Control that message marker is appropriate.");
      errorCounter += 1;
    }

    const userAmbiguousWords = this.findMatches(userWords, AmbiguesWords);
    const turnAmbiguousWords = this.findMatches(turnWords, AmbiguesWords);

    const notAcceptedUserAmbiguousWords = userAmbiguousWords.filter(
      (word) => !turnAmbiguousWords.includes(word),
    );

    if (notAcceptedUserAmbiguousWords.length > 0) {
      feedbackLines.push(
        "Avoid using ambiguous words: " +
          notAcceptedUserAmbiguousWords.map((w) => `'${w}'`).join(", ") +
          ".",
      );
      errorCounter += 1;
    }

    const turnPhoneticWords = this.findMatches(turnWords, PhoneticAlphabet);
    const userPhoneticWords = new Set(
      this.findMatches(userWords, PhoneticAlphabet),
    );

    if (!turnPhoneticWords.every((w) => userPhoneticWords.has(w))) {
      feedbackLines.push(
        "Missing phonetic alphabet words from expected response.",
      );
      errorCounter += 4;
    }

    return { feedbackLines: feedbackLines, errorCounter };
  }

  private controlEnding(
    ending: string,
    turnEnding: string,
  ): {
    correct: boolean;
    feedback: string;
  } {
    const correct = ending === turnEnding;

    return {
      correct,
      feedback: correct
        ? "Correct ending."
        : `Message should end with '${turnEnding}'.`,
    };
  }

  private async correctSpellingWithFallback(input: string): Promise<string> {
    try {
      return await this.llmModel.correctSpelling(input);
    } catch {
      console.warn("Spell check unavailable, using raw input.");
      return input;
    }
  }

  private async compareMeaningWithFallback(
    userInput: string,
    turnAnswer: string,
  ): Promise<boolean | null> {
    try {
      return await this.llmModel.compareMeaning(userInput, turnAnswer);
    } catch {
      console.warn("Meaning comparison unavailable.");
      return null;
    }
  }

  private checkInitiateContact(message: string): boolean {
    const sender = this.getSender();
    const senderCount = (message.match(new RegExp(sender, "g")) ?? []).length;

    // Supposed to contain the sender three times
    return senderCount === 3;
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

  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private getSender(): string {
    const sender =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.starter.name
        : this.scenario.participants.responder.name;

    return this.normalizeName(sender);
  }

  private getReceiver(): string {
    const receiver =
      this.userRole === this.scenario.participants.starter.role
        ? this.scenario.participants.responder.name
        : this.scenario.participants.starter.name;

    return this.normalizeName(receiver);
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
