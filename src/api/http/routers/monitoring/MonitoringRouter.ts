import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import MonitoringController from './MonitoringController';

export default class MonitoringRouter implements HttpRouter {

    constructor(private readonly _controller: MonitoringController) { }

    router(): Router {
        return Router()
            .get("/", asyncHandler((req, res) => this._controller.monitoring(req, res)))
    }

}