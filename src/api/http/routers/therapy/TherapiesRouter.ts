import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import TherapiesController from './TherapiesController';

export default class TherapiesRouter implements HttpRouter {

    constructor(private readonly _controller: TherapiesController) { }

    router(): Router {
        return Router()
            .get("/", asyncHandler((req, res) => this._controller.therapies(req, res)))
            .get("/until", asyncHandler((req, res) => this._controller.therapiesForTreatmentUntil(req, res)))
            .get("/:id", asyncHandler((req, res) => this._controller.therapy(req, res)))
            .post("/prescribe", asyncHandler((req, res) => this._controller.prescribeTherapy(req, res)))
            .post("/determine", asyncHandler((req, res) => this._controller.determineTherapy(req, res)))
            .post("/:id/add-medicament", asyncHandler((req, res) => this._controller.addMedicamentToTherapy(req, res)))
            .post("/:id/remove-medicament", asyncHandler((req, res) => this._controller.removeMedicamentToTherapy(req, res)))
            .post("/:id/change-label", asyncHandler((req, res) => this._controller.changeTherapyLabel(req, res)))

    }

}