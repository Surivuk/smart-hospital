import CommandChain from '@app/CommandChain';
import { CreateExamination } from '@app/commands/MedicationCommands';
import NotEmptyStringField from '@common/fields/NotEmptyStringField';
import Guid, { GuidFactory } from '@common/Guid';
import ExaminationQueryService from '@medication/examination/ExaminationQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class ExaminationsController {

    constructor(private readonly _commandChain: CommandChain, private readonly _query: ExaminationQueryService) { }

    async createExamination(req: Request, res: Response) {
        const { medicalCardId, doctorId, diagnosis } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new CreateExamination(
            Guid.create(medicalCardId),
            id,
            Guid.create(doctorId),
            NotEmptyStringField.create(diagnosis)
        ))
        res.header("Location", `/examinations/${id.toString()}`)
        res.sendStatus(201)
    }
    async examination(req: Request, res: Response) {
        res.json(await this._query.examination(Guid.create(req.params.id)))
    }
}