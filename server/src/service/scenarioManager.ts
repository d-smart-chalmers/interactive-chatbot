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
  private currentTurn: number;
  constructor(scenario: Scenario, role: UserRole) {
    this.scenario = scenario;
    this.role = role;
    this.chatbotIsStarter = (this.scenario.starter === Starter.VTS && this.role === UserRole.Vessel) 
      || (this.scenario.starter === Starter.VESSEL && this.role === UserRole.VTS)
    this.history = {
      turns: [],
      intruction: "",
    };
    this.currentTurn = 0;
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

  nextTurn(_userTurn: string, _timestamp: number) {
    //TODO: Implement logic and algoritms for check if answer is correct
  }

  submitTurn(userTurn: string, timestamp: number): {userTurn: UserTurn, chatbotTurn: ChatbotTurn, instruction: string}{
    //TODO: Implement logic and algoritms for check if answer is correct
    const userTurnObject = this.submitUserTurn(userTurn, timestamp);
    const chatbotTurnObject = this.submitChatbotTurn();
    const instruction = this.history.intruction;
    return {userTurn: userTurnObject, chatbotTurn:chatbotTurnObject, instruction}
  }

  private submitUserTurn(userTurn: string, timestamp: number) {
      const userTurnObject: UserTurn = {
      id: this.history.turns.length + 1,
      message: userTurn,
      timestamp: timestamp,
      type: TurnType.User,
      feedback: "Static feedback",
      correct: true,
    }
    if(this.chatbotIsStarter){
      this.currentTurn++;
    }
    if(this.role === UserRole.Vessel){
      this.history = {
        turns: [... this.history.turns, userTurnObject],
        intruction: this.scenario.scenarioTurns[this.currentTurn]!.vesselInstruction
      }
    } else {
      this.history = {
        turns: [... this.history.turns, userTurnObject],
        intruction: this.scenario.scenarioTurns[this.currentTurn]!.vtsInstruction
      }
    }
    return userTurnObject;
  }

  private submitChatbotTurn() {
    const chatbotTurnObject: ChatbotTurn = {
      id: this.history.turns.length + 1,
      message: this.role === UserRole.Vessel ? this.scenario.scenarioTurns[this.currentTurn]!.vtsMessage : this.scenario.scenarioTurns[this.currentTurn]!.vesselMessage,
      timestamp: Date.now(),
      type: TurnType.Chatbot,
    }
    if(!this.chatbotIsStarter){
      this.currentTurn++;
    }
    if(this.role === UserRole.Vessel){
      this.history = {
        turns: [... this.history.turns, chatbotTurnObject],
        intruction: this.scenario.scenarioTurns[this.currentTurn]!.vesselInstruction
      }
    } else {
      this.history = {
        turns: [... this.history.turns, chatbotTurnObject],
        intruction: this.scenario.scenarioTurns[this.currentTurn]!.vtsInstruction
      }
    }
    return chatbotTurnObject;
  }
  //private endScenario() {}

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
