import EventStoreEvent from '@helper/EventStoreEvent';
import Guid from '@helper/Guid';

import MonitoredValue from './MonitoredValue';

export class AddedMonitoredValue implements EventStoreEvent {
    constructor(public readonly treatmentId: Guid, public readonly value: MonitoredValue) { }
}