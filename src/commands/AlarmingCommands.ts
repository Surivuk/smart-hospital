import Alarm from '@app/alarming/alarm/Alarm';
import { ChainCommand } from '@app/CommandChain';
import Guid from '@common/Guid';

export class CreateAlarm implements ChainCommand {
    constructor(public readonly doctorId: Guid, public readonly treatmentId: Guid, public readonly alarm: Alarm) { }
}
export class ActivateAlarm implements ChainCommand {
    constructor(public readonly alarmId: Guid) { }
}
export class DeactivateAlarm implements ChainCommand {
    constructor(public readonly alarmId: Guid) { }
}