import EventStoreEvent from '@common/EventStoreEvent';
import Guid from '@common/Guid';

import HealthData from './healthData/HealthData';

export class AddedMonitoredValue implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly value: HealthData) { }
}