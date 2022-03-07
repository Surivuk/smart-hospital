import CommandChain from '@app/CommandChain';
import { DetermineTherapy, PrescribeTherapy } from '@app/commands/MedicationCommands';
import Guid, { GuidFactory } from '@common/Guid';
import ConsumptionFrequency from '@medication/medicamentConsumption/ConsumptionFrequency';
import ConsumptionRoute from '@medication/medicamentConsumption/ConsumptionRoute';
import MedicamentConsumption from '@medication/medicamentConsumption/MedicamentConsumption';
import TherapyQueryService from '@medication/therapy/TherapyQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class TherapiesController {

    constructor(
        private readonly _commandChain: CommandChain,
        private readonly _query: TherapyQueryService
    ) { }

    async prescribeTherapy(req: Request, res: Response) {
        const { medicalCardId, medicaments } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new PrescribeTherapy(
            Guid.create(medicalCardId),
            id,
            medicaments.map(({ medicamentId, strength, amount, route, frequency }: any) => new MedicamentConsumption(
                Guid.create(medicamentId), strength, amount, ConsumptionRoute.create(route), ConsumptionFrequency.create(frequency)
            ))
        ))
        res.header("Location", `/therapies/${id.toString()}`)
        res.sendStatus(201)
    }
    async determineTherapy(req: Request, res: Response) {
        const { hospitalTreatmentId, medicaments } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new DetermineTherapy(
            Guid.create(hospitalTreatmentId),
            id,
            medicaments.map(({ medicamentId, strength, amount, route, frequency }: any) => new MedicamentConsumption(
                Guid.create(medicamentId), strength, amount, ConsumptionRoute.create(route), ConsumptionFrequency.create(frequency)
            ))
        ))
        res.header("Location", `/therapies/${id.toString()}`)
        res.sendStatus(201)
    }
    async therapy(req: Request, res: Response) {
        res.json(await this._query.therapy(new Guid(req.params.id)))
    }
    async therapies(req: Request, res: Response) {
        res.json(await this._query.therapies())
    }
}