import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import AlarmingController from './AlarmingController';

export default class AlarmingRouter implements HttpRouter {

    constructor(private readonly _controller: AlarmingController) { }

    router(): Router {
        return Router()
            .post("/", asyncHandler((req, res) => this._controller.createAlarm(req, res)))
            .get("/", asyncHandler((req, res) => this._controller.alarms(req, res)))
            .get("/:id", asyncHandler((req, res) => this._controller.alarm(req, res)))
            .post("/:id/activate", asyncHandler((req, res) => this._controller.activateAlarm(req, res)))
            .post("/:id/deactivate", asyncHandler((req, res) => this._controller.deactivateAlarm(req, res)))
            .delete("/:id", asyncHandler((req, res) => this._controller.deleteAlarm(req, res)))
    }

}