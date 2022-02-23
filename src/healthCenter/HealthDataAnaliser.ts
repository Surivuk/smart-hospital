import { AggregateRoot } from "@common/AggregateRoot";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import HealthData from "./healthData/HealthData";
import { AddedMonitoredValue } from "./MonitoringEvents";
import Timestamp from "./Timestamp";
import Saturation from "./healthData/Saturation";

export type ReadData = {
    timestamp: number;
    values: { value: string; type: string; }[]
}


export class MonitoringSet {

    constructor(private readonly _timestamp: Timestamp, private readonly _values: HealthData[]) { }
}

export default class HealthCenter extends AggregateRoot {

    private _lastTimestamp: number = 0;
    private _lastValue: HealthData | undefined;

    processData(data: ReadData): void {
        const value = new Saturation(data.timestamp, parseInt(data.values[0].value));
        if (this._lastValue !== undefined && !this.hasSameStatus(value, this._lastValue)) {
            if (this._lastTimestamp !== this._lastValue.timestamp())
                this.applyChange(new AddedMonitoredValue(new Guid("mm1"), this._lastValue))
            this.applyChange(new AddedMonitoredValue(new Guid("mm1"), value))
            this._lastValue = value;
            return
        }

        if (
            (value.isNormal() && data.timestamp - this._lastTimestamp >= 60000) ||
            (value.isWarning() && data.timestamp - this._lastTimestamp >= 10000) ||
            (value.isCritical() && data.timestamp - this._lastTimestamp >= 5000)
        )
            this.applyChange(new AddedMonitoredValue(new Guid("mm1"), value))
        this._lastValue = value;
    }

    private hasSameStatus(v1: HealthData, v2: HealthData): boolean {
        return v1.isNormal() === v2.isNormal() &&
            v1.isWarning() === v2.isWarning() &&
            v1.isCritical() === v2.isCritical();
    }

    isTimeForStoring(): boolean {
        return false;
    }

    protected apply(event: EventStoreEvent): void {
        if (event instanceof AddedMonitoredValue) this.applyAddedMonitoredValue(event);
    }

    private applyAddedMonitoredValue(event: AddedMonitoredValue) {
        this._lastTimestamp = event.value.timestamp();
    }
}