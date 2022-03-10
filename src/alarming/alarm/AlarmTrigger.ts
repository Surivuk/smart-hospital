import StringField from "@common/fields/StringField";
import { HealthData } from "@monitoring/HealthData";
import TriggerOperator from "./TriggerOperation";

export type AlarmTriggerDTO = {
    key: string;
    value: string;
    operator: string;
}

export default class AlarmTrigger {
    constructor(
        private readonly _dataKey: StringField,
        private readonly _value: StringField,
        private readonly _operator: TriggerOperator
    ) { }

    mineResponsibility(data: HealthData) {
        return this._dataKey.toString() === data.type
    }
    triggered(data: HealthData): boolean {
        return this._operator.triggered(this._value.toString(), data.value)
    }
    dto(): AlarmTriggerDTO {
        return {
            key: this._dataKey.toString(),
            value: this._value.toString(),
            operator: this._operator.toString()
        }
    }
}