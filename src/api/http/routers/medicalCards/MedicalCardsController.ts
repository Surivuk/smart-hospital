import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import Guid from '@common/Guid';
import MedicalCardQueryService from '@medication/medicalCard/MedicalCardQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class MedicalCardsController {

    constructor(private readonly _query: MedicalCardQueryService) { }

    async medicalCard(req: Request, res: Response) {
        res.json(await this._query.medicalCard(new Guid(req.params.id)))
    }
    async medicalCards(req: Request, res: Response) {
        res.json(await this._query.medicalCards())
    }
}