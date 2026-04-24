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

    console.log(
      "Get feedback scenario manager userTurnId and scenario index: ",
      userTurnId,
      this.scenarioIndex,
    );
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
    if (this.scenarioIndex >= this.scenario.scenarioTurns.length) {
      return {
        chatbotTurns: [undefined as unknown as ChatbotTurn],
        instruction: "",
      };
    }
    const chatbotTurnObjects = this.createChatbotTurn();
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

  private createChatbotTurn() {
    const chatbotTurnObject: ChatbotTurn = {
      id: this.history.turns.length + 1,
      message:
        this.chatbotRole === UserRole.Vessel
          ? this.scenario.scenarioTurns[this.scenarioIndex]!.vesselMessage
          : this.scenario.scenarioTurns[this.scenarioIndex]!.vtsMessage,
      timestamp: Date.now(),
      type: TurnType.Chatbot,
      role: this.chatbotRole,
    };

    if (!this.chatbotIsStarter) {
      this.scenarioIndex++;
    }
    let secondChatbotTurnObject: ChatbotTurn[] = [];
    if (this.userRole === UserRole.Vessel) {
      if (this.scenario.scenarioTurns[this.scenarioIndex]!.vesselInstruction) {
        this.history = {
          turns: [...this.history.turns, chatbotTurnObject],
          intruction:
            this.scenarioIndex < this.scenario.scenarioTurns.length
              ? this.scenario.scenarioTurns[this.scenarioIndex]!
                  .vesselInstruction
              : "",
        };
      } else {
        this.scenarioIndex++;
        this.history = {
          turns: [...this.history.turns, chatbotTurnObject],
          intruction: this.history.intruction,
        };
        secondChatbotTurnObject = this.createChatbotTurn();
      }
    } else {
      if (this.scenario.scenarioTurns[this.scenarioIndex]!.vtsInstruction) {
        this.history = {
          turns: [...this.history.turns, chatbotTurnObject],
          intruction:
            this.scenarioIndex < this.scenario.scenarioTurns.length
              ? this.scenario.scenarioTurns[this.scenarioIndex]!.vtsInstruction
              : "",
        };
      } else {
        this.scenarioIndex++;
        this.history = {
          turns: [...this.history.turns, chatbotTurnObject],
          intruction: this.history.intruction,
        };
        secondChatbotTurnObject = this.createChatbotTurn();
      }
    }
    const chatbotTurnObjects: ChatbotTurn[] = [
      chatbotTurnObject,
      ...secondChatbotTurnObject,
    ];
    console.log(chatbotTurnObjects);
    return chatbotTurnObjects;
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
