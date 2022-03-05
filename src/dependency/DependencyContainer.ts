import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import PatientQueryService from '@app/adminstration/patient/PatientQueryService';
import AlarmQueryService from '@app/alarming/alarm/AlarmQueryService';
import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';
import MqttConnection from '@common/mqtt/MqttConnection';
import HealthDataQueryService from '@healthCenter/HealthDataQueryService';
import MedicalCardQueryService from '@medication/medicalCard/MedicalCardQueryService';

export interface Dependency {
    mqtt: MqttConnection;
    commandChain: CommandChain;
    eventBus: EventBus;

    // QueryServices
    patientQueryService: PatientQueryService;
    doctorQueryService: DoctorQueryService;
    medicalCardQueryService: MedicalCardQueryService;
    healthDataQueryService: HealthDataQueryService;
    alarmQueryService: AlarmQueryService;
}

export default interface DependencyContainer {
    createDependency(): Promise<this>;
    registerProcesses(): this;
    registerHandlers(): this;
    startHttpApi(): this;
    startMqttApi(): this;
}

