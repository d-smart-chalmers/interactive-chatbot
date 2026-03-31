import {
  ChatbotTurn,
  ScenarioChatHistory,
  TurnType,
  UserRole,
  UserTurn,
} from "@shared/scenarios/model";
import { Scenario, Starter } from "../model/scenarios.interface";

export class ScenarioManager {
  private scenario: Scenario;
  private role: UserRole;
  private chatbotIsStarter: boolean;
  private history: ScenarioChatHistory;
  private scenarioIndex: number;
  constructor(scenario: Scenario, role: UserRole) {
    this.scenario = scenario;
    this.role = role;
    this.chatbotIsStarter =
      (this.scenario.starter === Starter.VTS &&
        this.role === UserRole.Vessel) ||
      (this.scenario.starter === Starter.VESSEL && this.role === UserRole.VTS);
    this.history = {
      turns: [],
      intruction: "",
    };
    this.scenarioIndex = 0;
  }

  startScenario(): ScenarioChatHistory {
    this.history = {
      turns:
        this.role === UserRole.Vessel
          ? this.scenario.starter === Starter.VESSEL
            ? []
            : [
                {
                  id: 1,
                  message: this.scenario.scenarioTurns[0]!.vtsMessage,
                  timestamp: Date.now(),
                  type: TurnType.Chatbot,
                },
              ]
          : this.scenario.starter === Starter.VTS
            ? []
            : [
                {
                  id: 1,
                  message: this.scenario.scenarioTurns[0]!.vesselMessage,
                  timestamp: Date.now(),
                  type: TurnType.Chatbot,
                },
              ],
      intruction:
        this.role === UserRole.Vessel
          ? this.scenario.scenarioTurns[0]!.vesselInstruction
          : this.scenario.scenarioTurns[0]!.vtsInstruction,
    };
    return this.history;
  }

  submitAnswer(userAnswer: string, timestamp: number): { userTurn: UserTurn } {
    const userTurnObject = this.createUserTurn(userAnswer, timestamp);
    return { userTurn: userTurnObject };
  }

  getFeedback(userTurnId: number) {
    //TODO: Update with algoritms and stuff
    const userTurn = this.history.turns.find((t) => t.id === userTurnId);
    const updatedTurn: UserTurn = {
      ...(userTurn as UserTurn),
      feedback: "Static feedback",
      correct: userTurn?.message !== "incorrect",
    };
    this.history.turns[userTurnId - 1] = updatedTurn;
    if (updatedTurn.correct && this.chatbotIsStarter) {
      this.scenarioIndex++;
    }
    return updatedTurn;
  }

  getNextTurn(): { chatbotTurn: ChatbotTurn; instruction: string } {
    if (this.scenarioIndex >= this.scenario.scenarioTurns.length) {
      return {
        chatbotTurn: undefined as unknown as ChatbotTurn,
        instruction: "",
      };
    }
    const chatbotTurnObject = this.createChatbotTurn();
    const instruction = this.history.intruction;
    return { chatbotTurn: chatbotTurnObject, instruction };
  }

  private createUserTurn(userTurn: string, timestamp: number) {
    const userTurnObject: UserTurn = {
      id: this.history.turns.length + 1,
      message: userTurn,
      timestamp,
      type: TurnType.User,
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
        this.role === UserRole.Vessel
          ? this.scenario.scenarioTurns[this.scenarioIndex]!.vtsMessage
          : this.scenario.scenarioTurns[this.scenarioIndex]!.vesselMessage,
      timestamp: Date.now(),
      type: TurnType.Chatbot,
    };
    if (!this.chatbotIsStarter) {
      this.scenarioIndex++;
    }
    if (this.role === UserRole.Vessel) {
      this.history = {
        turns: [...this.history.turns, chatbotTurnObject],
        intruction:
          this.scenarioIndex < this.scenario.scenarioTurns.length
            ? this.scenario.scenarioTurns[this.scenarioIndex]!.vesselInstruction
            : "",
      };
    } else {
      this.history = {
        turns: [...this.history.turns, chatbotTurnObject],
        intruction:
          this.scenarioIndex < this.scenario.scenarioTurns.length
            ? this.scenario.scenarioTurns[this.scenarioIndex]!.vtsInstruction
            : "",
      };
    }
    return chatbotTurnObject;
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
    return this.role;
  }
}
