import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import Guid from '@common/Guid';
import MonitoringQueryService from '@monitoring/MonitoringQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class MonitoringController {

    constructor(private readonly _query: MonitoringQueryService) { }

    async monitoring(req: Request, res: Response) {
        if (req.query.treatmentId !== undefined)
            res.json(await this._query.monitoringForTreatment(Guid.create(req.query.treatmentId as string)))
        else
            res.json(await this._query.monitoringList())
    }
}