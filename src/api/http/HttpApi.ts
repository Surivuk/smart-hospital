import DoctorsController from "@app/api/http/routers/doctors/DoctorsController";
import { Dependency } from "@app/dependency/DependencyContainer";
import HttpServer from "@common/http/HttpServer";
import { Application } from "express";
import DoctorRouter from "./routers/doctors/DoctorRouter";
import PatientsController from "./routers/patients/PatientsController";
import PatientsRouter from "./routers/patients/PatientsRouter";


export default class HttpApi extends HttpServer {

    constructor(private readonly _dependency: Dependency) {
        super()
    }

    protected bindRoutes(app: Application): Application {
        return app
            .use("/patients", new PatientsRouter(
                new PatientsController(this._dependency.commandChain, this._dependency.patientQueryService)
            ).router())
            .use("/doctors", new DoctorRouter(new DoctorsController(this._dependency.doctorQueryService)).router())
    }
}