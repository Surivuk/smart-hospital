import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";
import { HealthData } from "@monitoring/HealthData";
import AlarmOperator from "./AlarmOperator";
import AlarmTrigger, { AlarmTriggerDTO } from "./AlarmTrigger";

export class AlarmError extends Error {
    constructor(message: string) {
        super(`[Alarm] Error - ${message}`);
    }
}

export type AlarmDTO = {
    id: string,
    operator: string;
    name: string;
    triggers: AlarmTriggerDTO[]
}

export default class Alarm {
    constructor(
        public readonly id: Guid,
        private readonly _operator: AlarmOperator,
        private readonly _name: StringField,
        private readonly _triggers: AlarmTrigger[]
    ) { }

    triggered(data: HealthData): boolean {
        const values: boolean[] = this._triggers.filter(trigger => trigger.mineResponsibility(data)).map(trigger => trigger.triggered(data))
        return eval(values.join(`  ${this._operator.toString()} `))
    }
    dto(): AlarmDTO {
        return {
            id: this.id.toString(),
            operator: this._operator.toString(),
            name: this._name.toString(),
            triggers: this._triggers.map(trigger => trigger.dto())
        }
    }
}