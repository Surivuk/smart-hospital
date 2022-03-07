import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import TherapiesController from './TherapiesController';

export default class TherapiesRouter implements HttpRouter {

    constructor(private readonly _controller: TherapiesController) { }

    router(): Router {
        return Router()
            .post("/prescribe", asyncHandler((req, res) => this._controller.prescribeTherapy(req, res)))
            .post("/determine", asyncHandler((req, res) => this._controller.determineTherapy(req, res)))
            .get("/", asyncHandler((req, res) => this._controller.therapies(req, res)))
            .get("/:id", asyncHandler((req, res) => this._controller.therapy(req, res)))
    }

}