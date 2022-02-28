import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import TherapiesController from './TherapiesController';

export default class TherapiesRouter implements HttpRouter {

    constructor(private readonly _controller: TherapiesController) { }

    router(): Router {
        return Router()
            .post("/", asyncHandler((req, res) => this._controller.prescribeTherapy(req, res)))
    }

}