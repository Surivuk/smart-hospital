import { AggregateRoot } from "@helper/AggregateRoot";
import EventStoreEvent from "@helper/EventStoreEvent";
import Guid from "@helper/Guid";
import MonitoredValue from "./MonitoredValue";
import { AddedMonitoredValue } from "./MonitoringEvents";
import Timestamp from "./Timestamp";
import Saturation from "./values/Saturation";

export type ReadData = {
    timestamp: number;
    values: { value: string; type: string; }[]
}


export class MonitoringSet {

    constructor(private readonly _timestamp: Timestamp, private readonly _values: MonitoredValue[]) { }
}

export default class Monitoring extends AggregateRoot {

    private _lastTimestamp: number = 0;
    private _lastValue: MonitoredValue | undefined;

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
            (value.isWarning() && data.timestamp - this._lastTimestamp >= 10000)
        )
            this.applyChange(new AddedMonitoredValue(new Guid("mm1"), value))
        this._lastValue = value;
    }

    private hasSameStatus(v1: MonitoredValue, v2: MonitoredValue): boolean {
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