import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import TreatmentsController from './TreatmentsController';

export default class TreatmentsRouter implements HttpRouter {

    constructor(private readonly _controller: TreatmentsController) { }

    router(): Router {
        return Router()
            .post("/", asyncHandler((req, res) => this._controller.openTreatment(req, res)))
    }

}