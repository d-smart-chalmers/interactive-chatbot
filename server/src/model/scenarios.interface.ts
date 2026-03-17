
interface ScenarioTurn{
    vesselInstruction: string,
    vesselMessage: string,
    vtsInstruction: string,
    vtsMessage: string,
}

export interface Scenario {
    id: string,
    description: string,
    scenarioTurns: ScenarioTurn[]
}