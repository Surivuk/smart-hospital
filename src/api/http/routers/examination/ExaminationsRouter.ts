import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import ExaminationsController from './ExaminationsController';

export default class ExaminationsRouter implements HttpRouter {

    constructor(private readonly _controller: ExaminationsController) { }

    router(): Router {
        return Router()
            .post("/", asyncHandler((req, res) => this._controller.createExamination(req, res)))
    }

}