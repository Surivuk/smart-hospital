import CommandChain from '@app/CommandChain';
import { AddMedicamentToTherapy, DetermineTherapy, PrescribeTherapy, RemoveMedicamentFromTherapy } from '@app/commands/MedicationCommands';
import NotEmptyStringField from '@common/fields/NotEmptyStringField';
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
        const { hospitalTreatmentId, medicaments, label } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new DetermineTherapy(
            Guid.create(hospitalTreatmentId),
            id,
            NotEmptyStringField.create(label),
            medicaments.map(({ medicamentId, strength, amount, route, frequency }: any) => new MedicamentConsumption(
                Guid.create(medicamentId), strength, amount, ConsumptionRoute.create(route), ConsumptionFrequency.create(frequency)
            ))
        ))
        res.header("Location", `/therapies/${id.toString()}`)
        res.sendStatus(201)
    }
    async addMedicamentToTherapy(req: Request, res: Response) {
        const { medicament } = req.body
        await this._commandChain.process(new AddMedicamentToTherapy(
            Guid.create(req.params.id),
            new MedicamentConsumption(
                Guid.create(medicament.medicamentId),
                medicament.strength,
                medicament.amount,
                ConsumptionRoute.create(medicament.route),
                ConsumptionFrequency.create(medicament.frequency)
            )
        ))
        res.sendStatus(204)
    }
    async removeMedicamentToTherapy(req: Request, res: Response) {
        const { medicamentId } = req.body
        await this._commandChain.process(new RemoveMedicamentFromTherapy(
            Guid.create(req.params.id),
            Guid.create(medicamentId)
        ))
        res.sendStatus(204)
    }
    async therapy(req: Request, res: Response) {
        res.json(await this._query.therapy(new Guid(req.params.id)))
    }
    async therapies(req: Request, res: Response) {
        res.json(await this._query.therapies())
    }
}