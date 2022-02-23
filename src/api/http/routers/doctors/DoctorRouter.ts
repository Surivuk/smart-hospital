import DoctorsController from '@app/api/http/routers/doctors/DoctorsController';
import HttpRouter from '@common/http/HttpRouter';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

export default class DoctorRouter implements HttpRouter {

    constructor(private readonly _controller: DoctorsController) { }

    router(): Router {
        return Router()
            .get("/", asyncHandler((req, res) => this._controller.doctors(req, res)))
    }

}