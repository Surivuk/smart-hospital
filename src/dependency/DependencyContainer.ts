import AdminstrationProcessor from '@adminstration/AdminstrationProcessor';
import PatientsController from '@app/api/http/routers/controllers/PatientsController';
import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import PatientRepository from '@adminstration/patient/PatientRepository';
import PatientQueryService from '@app/adminstration/patient/PatientQueryService';
import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';

export interface Dependency {
    commandChain: CommandChain;
    eventBus: EventBus;

    // QueryServices
    patientQueryService: PatientQueryService;
    doctorQueryService: DoctorQueryService;
}

export default interface DependencyContainer {
    dependency(): Promise<Dependency>
    registerProcesses(): void;
    registerEventHandlers(): void;
}

