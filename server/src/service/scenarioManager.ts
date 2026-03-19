import {
  ScenarioChatHistory,
  TurnType,
  UserRole,
} from "@shared/scenarios/model";
import { Scenario, Starter } from "../model/scenarios.interface";

export class ScenarioManager {
  private scenario: Scenario;
  private role: UserRole;
  private history: ScenarioChatHistory;
  constructor(scenario: Scenario, role: UserRole) {
    this.scenario = scenario;
    this.role = role;
    this.history = {
      turns: [],
      intruction: "",
    };
  }

  startScenario(): ScenarioChatHistory {
    this.history = {
      turns:
        this.role === UserRole.Vessel
          ? this.scenario.starter === Starter.VESSEL
            ? []
            : [
                {
                  message: this.scenario.scenarioTurns[0]!.vtsMessage,
                  timestamp: new Date(),
                  type: TurnType.Chatbot,
                },
              ]
          : this.scenario.starter === Starter.VTS
            ? []
            : [
                {
                  message: this.scenario.scenarioTurns[0]!.vesselMessage,
                  timestamp: new Date(),
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

  nextTurn() {}

  private endScenario() {}

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
