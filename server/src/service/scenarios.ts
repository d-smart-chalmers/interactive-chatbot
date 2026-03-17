import { ScenarioDescription } from "../../../shared/scenarios/model";
import { Scenario } from "../model/scenarios.interface";
import { HttpError } from "../router/httpError";

export class ScenariosService {
    private aScenarios: Scenario[];
    private bScenarios: Scenario[];


    constructor(aScenarios: Scenario[], bScenarios: Scenario[]){
        this.aScenarios = aScenarios;
        this.bScenarios = bScenarios;
    }

    getDescriptions(): ScenarioDescription[][]{
        const aDescriptions = this.aScenarios.map(s => {
            return {
                id: s.id,
                description: s.description,
            }
        });
        const bDescriptions = this.bScenarios.map(s => {
            return {
                id: s.id,
                description: s.description,
            }
        });
        if(!aDescriptions && !bDescriptions){
            throw new HttpError("No scenarios found", 404);
        }
        return [aDescriptions, bDescriptions];
    }

}