import { ScenarioDescriptionList, UserRole } from "@shared/scenarios/model.js";
import { HttpError } from "../router/httpError.js";
import { ScenarioManager } from "./scenarioManager.js";
import { Scenario, ScenarioList } from "@src/model/scenarios.interface.js";

export class ScenariosService {
  private allScenarios: Scenario[];
  private scenarioLists: ScenarioList[];
  private activeScenarios: Map<string, ScenarioManager>;

  constructor(scenarioLists: ScenarioList[]) {
    this.scenarioLists = scenarioLists;
    this.allScenarios = scenarioLists.map((list) => list.scenarios).flat().map((scen) => (scen as Scenario));
    this.activeScenarios = new Map();
  }

  getDescriptions(): ScenarioDescriptionList[] {
    const scenarioDescriptionLists: ScenarioDescriptionList[] = this.scenarioLists.map((list) => ({
      headerText: list.headerText,
      headerColor: list.headerColor,
      scenarios: list.scenarios.map((scen) => ({
        id: scen.id,
        description: scen.description,
      })),
    }));
    return scenarioDescriptionLists;
  }

  startScenario(userId: string, scenarioId: string, userRole: UserRole) {
    const scenario = this.allScenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      throw new HttpError("Scenario not found", 404);
    }
    const description = scenario.description;
    let sManager = this.activeScenarios.get(userId);
    if (sManager) {
      if (sManager.getId() === scenarioId && sManager.getRole() === userRole) {
        const history = sManager.resumeScenario();
        return { description, history, newScenario: false };
      }
    }
    sManager = new ScenarioManager(scenario, userRole);
    this.activeScenarios.set(userId, sManager);
    const history = sManager.startScenario();

    return { description, history, newScenario: true };
  }

  submitAnswer(
    userId: string,
    scenarioId: string,
    answer: string,
    timestamp: number,
  ) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    if (sManager.getId() !== scenarioId) {
      throw new HttpError("Scenario not found", 404);
    }
    const userTurn = sManager.submitAnswer(answer, timestamp);
    return userTurn;
  }

  async getFeedback(userId: string, userTurnId: number) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    const turnWithFeedback = sManager.getFeedback(userTurnId);
    return turnWithFeedback;
  }

  getNextTurn(userId: string) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    const { chatbotTurns, instruction } = sManager.getNextTurn();
    return { chatbotTurns, instruction };
  }

  retryScenario(userId: string) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    const updatedHistory = sManager.retryScenario();
    return updatedHistory;
  }

  private getScenarioManagerOrThrow(userId: string) {
    const sManager = this.activeScenarios.get(userId);
    if (!sManager) {
      throw new HttpError("No active scenario found", 404);
    }
    return sManager;
  }
}
