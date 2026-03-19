
interface ScenarioTurn{
    vesselInstruction: string,
    vesselMessage: string,
    vtsInstruction: string,
    vtsMessage: string,
}
export enum Starter {
    VESSEL = "vessel",
    VTS = "vts",
}
export interface Scenario {
    id: string,
    description: string,
    starter: Starter,
    scenarioTurns: ScenarioTurn[]
}