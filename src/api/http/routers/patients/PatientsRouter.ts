import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import PatientsController from './PatientsController';

export default class PatientsRouter implements HttpRouter {

    constructor(private readonly _controller: PatientsController) { }

    router(): Router {
        return Router()
            .post("/", asyncHandler((req, res) => this._controller.addPatient(req, res)))
            .get("/", asyncHandler((req, res) => this._controller.patients(req, res)))
            .get("/:id", asyncHandler((req, res) => this._controller.patient(req, res)))
    }

}