import CommandChain from '@app/CommandChain';
import {  OpenHospitalTreatment, RemoveTherapyFromTreatment } from '@app/commands/MedicationCommands';
import Guid, { GuidFactory } from '@common/Guid';
import HospitalTreatmentQueryService from '@medication/hospitalTreatment/HospitalTreatmentQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class TreatmentsController {

    constructor(
        private readonly _commandChain: CommandChain,
        private readonly _query: HospitalTreatmentQueryService
    ) { }

    async openTreatment(req: Request, res: Response) {
        const { medicalCardId } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new OpenHospitalTreatment(Guid.create(medicalCardId), id))
        res.header("Location", `/treatments/${id.toString()}`)
        res.sendStatus(201)
    }
    async removeTherapy(req: Request, res: Response) {
        const { therapyId } = req.body
        await this._commandChain.process(new RemoveTherapyFromTreatment(Guid.create(therapyId), Guid.create(req.params.id)))
        res.sendStatus(204)
    }
    async treatment(req: Request, res: Response) {
        res.json(await this._query.treatment(Guid.create(req.params.id)))
    }
    async treatments(req: Request, res: Response) {
        res.json(await this._query.treatments(Guid.create(req.query.medicalCardId as string)))
    }
}