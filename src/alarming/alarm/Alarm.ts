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
    id: string;
    treatmentId: string;
    name: string;
    trigger: AlarmTriggerDTO
}

export default class Alarm {
    constructor(
        public readonly id: Guid,
        private readonly _treatmentId: Guid,
        private readonly _name: StringField,
        private readonly _trigger: AlarmTrigger
    ) { }

    triggered(data: HealthData): boolean {
        if (this._trigger.mineResponsibility(data))
            return this._trigger.triggered(data);
        return false;
    }
    dto(): AlarmDTO {
        return {
            id: this.id.toString(),
            treatmentId: this._treatmentId.toString(),
            name: this._name.toString(),
            trigger: this._trigger.dto()
        }
    }
}