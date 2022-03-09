import Guid from '@common/Guid';
import HealthDataQueryService from '@healthCenter/HealthDataQueryService';
import { Request, Response } from 'express-serve-static-core';

export default class HealthCenterController {

    constructor(private readonly _query: HealthDataQueryService) { }

    async healthDataPerDate(req: Request, res: Response) {
        const { date } = req.query
        res.json(await this._query.healthDataPerDate(new Guid(req.params.id), new Date(date as string)))
    }
}