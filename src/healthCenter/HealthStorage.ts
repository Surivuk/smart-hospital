import { AggregateRoot } from "@common/AggregateRoot";
import EventStoreEvent from "@common/EventStoreEvent";
import Guid from "@common/Guid";
import HealthData from "./healthData/HealthData";
import { AddedMonitoredValue } from "./MonitoringEvents";
import Timestamp from "./Timestamp";
import Saturation from "./healthData/Saturation";
import HealthDataRepository from "./HealthDataRepository";

export type ReceivedHealthData = {
    timestamp: number;
    value: string;
    type: string;
}

export default class HealthStorage {

    private readonly _lastReceivedValue: Map<string, { timestamp: number, value: string }>;
    private _lastSavedTimestamp: number;

    constructor(
        private readonly _repository: HealthDataRepository,
        private readonly _healthDataFactory: { [key: string]: (timestamp: number, value: string) => HealthData }
    ) {
        this._lastReceivedValue = new Map();
        this._lastSavedTimestamp = 0;
    }

    async storeHealthData({ type, timestamp, value }: ReceivedHealthData) {
        const healthData = this._healthDataFactory[type](timestamp, value);
        if (healthData === undefined) {
            console.log(`Not found any health data factory for provided type. Type: "${type}"`)
            return;
        }

        const lastReceivedValue = this._lastReceivedValue.get(type);
        const lastData = lastReceivedValue !== undefined ? this.healthData(type, lastReceivedValue) : undefined;

        const forStoring: HealthData[] = this.findDataForStorage(lastData, healthData)
        if (forStoring.length > 0) {
            await this._repository.save(forStoring)
            this._lastSavedTimestamp = forStoring[forStoring.length - 1].timestamp()
            this._lastReceivedValue.set(type, { timestamp, value })
        }
    }

    private healthData(type: string, lastReceivedValue: { timestamp: number; value: string; }) {
        const data = this._healthDataFactory[type](lastReceivedValue.timestamp, lastReceivedValue.value);
        if (data === undefined) {
            throw new Error(`Not found factory for provided data. Type: ${type}`)
        }
        return data;
    }

    private findDataForStorage(lastData: HealthData | undefined, newData: HealthData): HealthData[] {
        const timeDifferenceGraterThen = (lastData: HealthData, newData: HealthData, seconds: number) =>
            newData.timestamp() - lastData.timestamp() >= 1000 * seconds

        if (lastData === undefined) return [newData];
        if (newData.equals(lastData)) return [];
        if (newData.isInSameCategoryAs(lastData)) {
            if (newData.isNormal() && timeDifferenceGraterThen(lastData, newData, 60)) return [newData]
            if (newData.isWarning() && timeDifferenceGraterThen(lastData, newData, 30)) return [newData]
            if (newData.isCritical() && timeDifferenceGraterThen(lastData, newData, 10)) return [newData]
        }
        else {
            if (this._lastSavedTimestamp === lastData.timestamp()) return [newData];
            return [lastData, newData]
        }
        return []
    }
}