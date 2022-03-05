import Alarm from '@app/alarming/alarm/Alarm';
import AlarmOperator from '@app/alarming/alarm/AlarmOperator';
import AlarmQueryService from '@app/alarming/alarm/AlarmQueryService';
import AlarmTrigger from '@app/alarming/alarm/AlarmTrigger';
import TriggerOperation from '@app/alarming/alarm/TriggerOperation';
import CommandChain from '@app/CommandChain';
import { ActivateAlarm, CreateAlarm, DeactivateAlarm } from '@app/commands/AlarmingCommands';
import NotEmptyStringField from '@common/fields/NotEmptyStringField';
import Guid, { GuidFactory } from '@common/Guid';
import { Request, Response } from 'express-serve-static-core';

export default class AlarmingController {

    constructor(
        private readonly _query: AlarmQueryService,
        private readonly _commandChain: CommandChain
    ) { }

    async createAlarm(req: Request, res: Response) {
        const { doctorId, treatmentId, name, operator, triggers } = req.body
        const alarmId = GuidFactory.guid()
        await this._commandChain.process(new CreateAlarm(
            Guid.create(doctorId),
            Guid.create(treatmentId),
            new Alarm(
                alarmId,
                AlarmOperator.create(operator),
                NotEmptyStringField.create(name),
                triggers.map((trigger: any) => new AlarmTrigger(
                    NotEmptyStringField.create(trigger.key),
                    NotEmptyStringField.create(trigger.value),
                    TriggerOperation.create(trigger.operator)
                ))
            )
        ))
        res.header("Location", `/alarm/${alarmId.toString()}`)
        res.sendStatus(201);
    }
    async activateAlarm(req: Request, res: Response) {
        await this._commandChain.process(new ActivateAlarm(Guid.create(req.params.id)))
        res.sendStatus(204);
    }
    async deactivateAlarm(req: Request, res: Response) {
        await this._commandChain.process(new DeactivateAlarm(Guid.create(req.params.id)))
        res.sendStatus(204);
    }
    async alarms(req: Request, res: Response) {
        const { doctorId } = req.query
        res.json(await this._query.alarms(Guid.create(doctorId as string)))
    }
    async alarm(req: Request, res: Response) {
        res.json(await this._query.alarm(Guid.create(req.params.id)))
    }
}