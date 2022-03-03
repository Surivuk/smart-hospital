import { ChainCommand } from '@app/CommandChain';
import Guid from '@common/Guid';
import { HealthData } from '@monitoring/HealthData';

export class ProcessHealthData implements ChainCommand {
    constructor(public readonly monitoringId: Guid, public readonly data: HealthData) { }
}