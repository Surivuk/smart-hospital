import MedicamentQueryService from '@medication/medicaments/MedicamentQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class MedicamentsController {

    constructor(private readonly _query: MedicamentQueryService) { }

    async medicaments(req: Request, res: Response) {
        res.json(await this._query.medicaments())
    }
}