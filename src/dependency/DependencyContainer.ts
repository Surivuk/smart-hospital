import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import PatientQueryService from '@app/adminstration/patient/PatientQueryService';
import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';
import MqttConnection from '@common/mqtt/MqttConnection';
import MedicalCardQueryService from '@medication/medicalCard/MedicalCardQueryService';

export interface Dependency {
    mqtt: MqttConnection;
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
    startMqttApi(): this;
}

