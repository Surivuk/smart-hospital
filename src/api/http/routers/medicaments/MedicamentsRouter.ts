import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import MedicamentsController from './MedicamentsController';

export default class MedicamentsRouter implements HttpRouter {

    constructor(private readonly _controller: MedicamentsController) { }

    router(): Router {
        return Router()
            .get("/", asyncHandler((req, res) => this._controller.medicaments(req, res)))
    }

}