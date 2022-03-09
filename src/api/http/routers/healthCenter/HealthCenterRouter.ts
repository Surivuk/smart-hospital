import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import HealthCenterController from './HealthCenterController';

export default class HealthCenterRouter implements HttpRouter {

    constructor(private readonly _controller: HealthCenterController) { }

    router(): Router {
        return Router()
            .get("/:id", asyncHandler((req, res) => this._controller.healthDataPerDate(req, res)))
    }

}