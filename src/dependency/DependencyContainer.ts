import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import PatientQueryService from '@app/adminstration/patient/PatientQueryService';
import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';
import MedicalCardQueryService from '@medication/medicalCard/MedicalCardQueryService';

export interface Dependency {
    commandChain: CommandChain;
    eventBus: EventBus;

    // QueryServices
    patientQueryService: PatientQueryService;
    doctorQueryService: DoctorQueryService;
    medicalCardQueryService: MedicalCardQueryService;
}

export default interface DependencyContainer {
    createDependency(): Promise<this>;
    registerProcesses(): this;
    registerHandlers(): this;
    startHttpApi(): this;
}

