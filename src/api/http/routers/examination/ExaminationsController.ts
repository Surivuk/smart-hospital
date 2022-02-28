import CommandChain from '@app/CommandChain';
import CreateExamination from '@app/commands/MedicationCommands';
import NotEmptyStringField from '@common/fields/NotEmptyStringField';
import Guid, { GuidFactory } from '@common/Guid';
import { Request, Response } from 'express-serve-static-core';

export default class ExaminationsController {

    constructor(private readonly _commandChain: CommandChain) { }

    async createExamination(req: Request, res: Response) {
        const { medicalCardId, doctorId, diagnose } = req.body
        const id = Guid.create(doctorId)
        await this._commandChain.process(new CreateExamination(
            Guid.create(medicalCardId),
            id,
            Guid.create(doctorId),
            NotEmptyStringField.create(diagnose)
        ))
        res.header("Location", `/examinations/${id.toString()}`)
        res.sendStatus(201)
    }
}