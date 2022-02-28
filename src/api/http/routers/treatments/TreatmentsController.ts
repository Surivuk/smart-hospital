import CommandChain from '@app/CommandChain';
import { OpenHospitalTreatment } from '@app/commands/MedicationCommands';
import Guid, { GuidFactory } from '@common/Guid';
import { Request, Response } from 'express-serve-static-core';

export default class TreatmentsController {

    constructor(private readonly _commandChain: CommandChain) { }

    async openTreatment(req: Request, res: Response) {
        const { medicalCardId } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new OpenHospitalTreatment(Guid.create(medicalCardId), id))
        res.header("Location", `/treatments/${id.toString()}`)
        res.sendStatus(201)
    }
}