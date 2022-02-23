import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class DoctorsController {

    constructor(private readonly _query: DoctorQueryService) { }

    async doctors(req: Request, res: Response) {
        res.json(await this._query.doctors())
    }
}