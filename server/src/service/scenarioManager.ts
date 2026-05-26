import {
  AnswerAccuracy,
  ChatbotTurn,
  ScenarioChatHistory,
  TurnType,
  UserRole,
  UserTurn,
} from "@shared/scenarios/model.js";

import { Scenario } from "../model/scenarios.interface.js";
import { TurnManager } from "./turnManager.js";

export class ScenarioManager {
  private scenario: Scenario;
  private userRole: UserRole;
  private chatbotRole: UserRole;
  private chatbotIsStarter: boolean;
  private history: ScenarioChatHistory;
  private scenarioIndex: number;
  private turnManager: TurnManager;

  constructor(scenario: Scenario, userRole: UserRole) {
    this.scenario = scenario;
    this.userRole = userRole;
    this.chatbotRole =
      userRole === UserRole.VTS ? UserRole.Vessel : UserRole.VTS;
    this.chatbotIsStarter =
      scenario.participants.starter.role === this.chatbotRole;
    this.history = {
      turns: [],
      intruction: "",
    };
    this.scenarioIndex = 0;
    this.turnManager = new TurnManager(this.scenario, this.userRole);
  }

  startScenario(): ScenarioChatHistory {
    this.history = {
      turns:
        this.userRole === UserRole.Vessel
          ? this.scenario.participants.starter.role === UserRole.Vessel
            ? []
            : [
                {
                  id: 1,
                  message: this.scenario.scenarioTurns[0]!.vtsMessage,
                  timestamp: Date.now(),
                  type: TurnType.Chatbot,
                  role: UserRole.VTS,
                },
              ]
          : this.scenario.participants.starter.role === UserRole.VTS
            ? []
            : [
                {
                  id: 1,
                  message: this.scenario.scenarioTurns[0]!.vesselMessage,
                  timestamp: Date.now(),
                  type: TurnType.Chatbot,
                  role: UserRole.Vessel,
                },
              ],
      intruction:
        this.userRole === UserRole.Vessel
          ? this.scenario.scenarioTurns[0]!.vesselInstruction
          : this.scenario.scenarioTurns[0]!.vtsInstruction,
    };
    return this.history;
  }

  submitAnswer(userAnswer: string, timestamp: number): { userTurn: UserTurn } {
    const userTurnObject = this.createUserTurn(userAnswer, timestamp);

    this.turnManager.startGenerateFeedback(userTurnObject, this.scenarioIndex);

    return { userTurn: userTurnObject };
  }

  async getFeedback(userTurnId: number) {
    const userTurnWithFeedback =
      await this.turnManager.waitForFeedback(userTurnId);

    this.history.turns[userTurnId - 1] = userTurnWithFeedback;

    if (
      !(userTurnWithFeedback.answerAccuracy === AnswerAccuracy.Incorrect) &&
      this.chatbotIsStarter
    ) {
      this.scenarioIndex++;
    }

    return userTurnWithFeedback;
  }

  getNextTurn(): { chatbotTurns: ChatbotTurn[]; instruction: string } {
    console.log("scenarioindex", this.scenarioIndex);
    console.log("scenario turns length", this.scenario.scenarioTurns.length);
    if (this.scenarioIndex >= this.scenario.scenarioTurns.length) {
      return {
        chatbotTurns: [undefined as unknown as ChatbotTurn],
        instruction: "",
      };
    }
    const chatbotTurnObjects = this.createChatbotTurn();
    console.log("chatbot turn objects", chatbotTurnObjects);
    const instruction = this.history.intruction;
    return { chatbotTurns: chatbotTurnObjects, instruction };
  }

  private createUserTurn(userTurn: string, timestamp: number) {
    const userTurnObject: UserTurn = {
      id: this.history.turns.length + 1,
      message: userTurn,
      timestamp,
      type: TurnType.User,
      role: this.userRole,
    };
    this.history = {
      turns: [...this.history.turns, userTurnObject],
      intruction: this.history.intruction,
    };

    return userTurnObject;
  }

private createChatbotTurn(): ChatbotTurn[] {
    // Guard: scenario is over
    if (this.scenarioIndex >= this.scenario.scenarioTurns.length) {
        this.history = { ...this.history, intruction: "" };
        return [];
    }

    const currentTurn = this.scenario.scenarioTurns[this.scenarioIndex]!;

    const chatbotTurnObject: ChatbotTurn = {
        id: this.history.turns.length + 1,
        message:
            this.chatbotRole === UserRole.Vessel
                ? currentTurn.vesselMessage
                : currentTurn.vtsMessage,
        timestamp: Date.now(),
        type: TurnType.Chatbot,
        role: this.chatbotRole,
    };

    // Always increment after reading chatbot message
    this.scenarioIndex++;

    // Guard after increment
    if (this.scenarioIndex >= this.scenario.scenarioTurns.length) {
        this.history = {
            turns: [...this.history.turns, chatbotTurnObject],
            intruction: "",
        };
        return [chatbotTurnObject];
    }

    const nextTurn = this.scenario.scenarioTurns[this.scenarioIndex]!;
    const instruction =
        this.userRole === UserRole.Vessel
            ? nextTurn.vesselInstruction
            : nextTurn.vtsInstruction;

    if (instruction) {
        this.history = {
            turns: [...this.history.turns, chatbotTurnObject],
            intruction: instruction,
        };
        return [chatbotTurnObject];
    } else {
        if (this.scenarioIndex < this.scenario.scenarioTurns.length - 1) {
            this.history = {
                turns: [...this.history.turns, chatbotTurnObject],
                intruction: this.history.intruction,
            };
            this.scenarioIndex++;
            const secondChatbotTurnObjects = this.createChatbotTurn();
            return [chatbotTurnObject, ...secondChatbotTurnObjects];
        } else {
            this.history = {
                turns: [...this.history.turns, chatbotTurnObject],
                intruction: "",
            };
            return [chatbotTurnObject];
        }
    }
}

  //private endScenario() {}
  retryScenario(): ScenarioChatHistory {
    this.scenarioIndex = 0;
    return this.startScenario();
  }

  resumeScenario(): ScenarioChatHistory {
    return this.history;
  }
  getId() {
    return this.scenario.id;
  }
  getRole() {
    return this.userRole;
  }
}
