import EventStoreEvent from '@helper/EventStoreEvent';
import Guid from '@helper/Guid';

import HealthData from './healthData/HealthData';

export class AddedMonitoredValue implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly value: HealthData) { }
}