import DoctorsController from '@app/api/http/routers/doctors/DoctorsController';
import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import MedicalCardsController from './MedicalCardsController';

export default class MedicalCardsRouter implements HttpRouter {

    constructor(private readonly _controller: MedicalCardsController) { }

    router(): Router {
        return Router()
            .get("/", asyncHandler((req, res) => this._controller.medicalCards(req, res)))
    }

}