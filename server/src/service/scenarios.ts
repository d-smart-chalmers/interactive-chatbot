import { ScenarioDescription, UserRole } from "@shared/scenarios/model";
import { Scenario } from "../model/scenarios.interface";
import { HttpError } from "../router/httpError";
import { ScenarioManager } from "./scenarioManager";

export class ScenariosService {
  private aScenarios: Scenario[];
  private bScenarios: Scenario[];
  private allScenarios: Scenario[];
  private activeScenarios: Map<string, ScenarioManager>;

  constructor(aScenarios: Scenario[], bScenarios: Scenario[]) {
    this.aScenarios = aScenarios;
    this.bScenarios = bScenarios;
    this.allScenarios = [...aScenarios, ...bScenarios];
    this.activeScenarios = new Map();
  }

  getDescriptions(): ScenarioDescription[][] {
    const aDescriptions = this.aScenarios.map((s) => {
      return {
        id: s.id,
        description: s.description,
      };
    });
    const bDescriptions = this.bScenarios.map((s) => {
      return {
        id: s.id,
        description: s.description,
      };
    });
    if (!aDescriptions && !bDescriptions) {
      throw new HttpError("No scenarios found", 404);
    }
    return [aDescriptions, bDescriptions];
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

  getFeedback(userId: string, userTurnId: number) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    const turnWithFeedback = sManager.getFeedback(userTurnId);
    return turnWithFeedback;
  }
  getNextTurn(userId: string) {
    const sManager = this.getScenarioManagerOrThrow(userId);
    const { chatbotTurn, instruction } = sManager.getNextTurn();
    return { chatbotTurn, instruction };
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
