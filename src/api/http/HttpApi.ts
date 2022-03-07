import DoctorsController from "@app/api/http/routers/doctors/DoctorsController";
import { Dependency } from "@app/dependency/DependencyContainer";
import HttpServer from "@common/http/HttpServer";
import HealthCenter from "@healthCenter/HealthDataAnaliser";
import { Application } from "express";
import AlarmingController from "./routers/alarming/AlarmingController";
import AlarmingRouter from "./routers/alarming/AlarmingRouter";
import DoctorRouter from "./routers/doctors/DoctorRouter";
import ExaminationsController from "./routers/examination/ExaminationsController";
import ExaminationsRouter from "./routers/examination/ExaminationsRouter";
import HealthCenterController from "./routers/healthCeneter/HealthCenterController";
import HealthCenterRouter from "./routers/healthCeneter/HealthCenterRouter";
import MedicalCardsController from "./routers/medicalCards/MedicalCardsController";
import MedicalCardsRouter from "./routers/medicalCards/MedicalCardsRouter";
import PatientsController from "./routers/patients/PatientsController";
import PatientsRouter from "./routers/patients/PatientsRouter";
import TherapiesController from "./routers/therapy/TherapiesController";
import TherapiesRouter from "./routers/therapy/TherapiesRouter";
import TreatmentsController from "./routers/treatments/TreatmentsController";
import TreatmentsRouter from "./routers/treatments/TreatmentsRouter";


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
            .use("/medical-cards", new MedicalCardsRouter(new MedicalCardsController(this._dependency.medicalCardQueryService)).router())
            .use("/examinations", new ExaminationsRouter(new ExaminationsController(this._dependency.commandChain)).router())
            .use("/therapies", new TherapiesRouter(new TherapiesController(this._dependency.commandChain, this._dependency.therapyQueryService)).router())
            .use("/hospital-treatments", new TreatmentsRouter(new TreatmentsController(this._dependency.commandChain, this._dependency.hospitalTreatmentQueryService)).router())
            .use("/health-center", new HealthCenterRouter(new HealthCenterController(this._dependency.healthDataQueryService)).router())
            .use("/alarming", new AlarmingRouter(new AlarmingController(this._dependency.alarmQueryService, this._dependency.commandChain)).router())
    }
}