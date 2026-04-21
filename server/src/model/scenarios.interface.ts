import { UserRole } from "@shared/scenarios/model.js";

interface ScenarioTurn {
  vesselInstruction: string;
  vesselMessage: string;
  vtsInstruction: string;
  vtsMessage: string;
}

interface Participant {
  role: UserRole;
  name: string;
}

export interface Scenario {
  id: string;
  description: string;
  participants: { starter: Participant; responder: Participant };
  scenarioTurns: ScenarioTurn[];
}
