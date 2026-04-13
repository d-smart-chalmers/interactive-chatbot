import { UserRole, UserTurn } from "@shared/scenarios/model";
import { Scenario } from "@src/model/scenarios.interface";
import CerebrasLLMService from "./cerebrasllmservice";

export class TurnManager {
  private feedbackPromises: Map<number, Promise<UserTurn>>;
  private userRole: UserRole;
  private scenario: Scenario;
  private llmModel: CerebrasLLMService;

  constructor(scenario: Scenario, userRole: UserRole) {
    this.scenario = scenario;
    this.userRole = userRole;
    this.feedbackPromises = new Map();
    this.llmModel = new CerebrasLLMService();
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

    const correct = await this.llmModel.compareMeaning(userText, turnAnswer);

    let messageFeedback = this.controlUserMessage(userTurn, correct);

    // TODO: remove later, just used for testing atm
    messageFeedback =
      "Correct?: " +
      correct +
      messageFeedback +
      " User answer: " +
      userText +
      " and turn answer: " +
      turnAnswer;

    const updatedTurn: UserTurn = {
      ...userTurn,
      feedback: messageFeedback,
      correct: correct,
    };

    return updatedTurn;
  }

  async waitForFeedback(userTurnIndex: number): Promise<UserTurn> {
    const feedbackPromise = this.feedbackPromises.get(userTurnIndex);

    if (!feedbackPromise) {
      console.log("Feedback promise missing for turn:", userTurnIndex);

      return {
        id: userTurnIndex,
        message: "debug",
        feedback: "Fallback feedback generated in waitForFeedback",
        correct: false,
        timestamp: Date.now(),
      } as UserTurn;
    }

    const updatedTurn = await feedbackPromise;

    this.feedbackPromises.delete(userTurnIndex);

    return updatedTurn;
  }

  // TODO still need to properly implement this
  private controlUserMessage(turnInfo: UserTurn, correct: boolean): string {
    let message = turnInfo.message;

    let greeting = identifyGreeting(message);

    let isGreetingCorrect = checkGreeting(greeting);

    let contentArray = identifyContent(message);

    let isContentCorrect = checkContent(contentArray);

    let feedback = "";

    if (correct) {
      feedback = feedback + "Message is good";
    } else {
      feedback = feedback + "Message is not sufficient";
    }

    return feedback;
  }

  private async compareTexts(
    userInput: string,
    turnAnswer: string,
  ): Promise<boolean> {
    return await this.llmModel.compareMeaning(userInput, turnAnswer);
  }
}

function identifyGreeting(userInput: string): string {
  let greeting = userInput;

  return greeting;
}

function checkGreeting(greeting: string): boolean {
  if (greeting) return true;

  return true;
}

function identifyContent(userInput: string): string[] {
  let content = [userInput];

  return content;
}

function checkContent(content: string[]): boolean {
  if (content) return true;

  return true;
}

function identifyEnding(userInput: string): string {
  let ending = userInput;

  return ending;
}
