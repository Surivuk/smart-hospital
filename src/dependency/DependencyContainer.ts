import DoctorQueryService from '@adminstration/doctor/DoctorQueryService';
import AlarmNotificationQueryService from '@alarming/alarmNotification/AlarmNotificationQueryService';
import PatientQueryService from '@app/adminstration/patient/PatientQueryService';
import AlarmQueryService from '@app/alarming/alarm/AlarmQueryService';
import CommandChain from '@app/CommandChain';
import EventBus from '@app/EventBus';
import MqttConnection from '@common/mqtt/MqttConnection';
import HealthDataQueryService from '@healthCenter/HealthDataQueryService';
import HospitalTreatmentQueryService from '@medication/hospitalTreatment/HospitalTreatmentQueryService';
import MedicalCardQueryService from '@medication/medicalCard/MedicalCardQueryService';
import TherapyQueryService from '@medication/therapy/TherapyQueryService';

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
    therapyQueryService: TherapyQueryService;
    hospitalTreatmentQueryService: HospitalTreatmentQueryService;
    alarmNotificationQueryService: AlarmNotificationQueryService;
}

export default interface DependencyContainer {
    createDependency(): Promise<this>;
    registerProcesses(): this;
    registerHandlers(): this;
    startHttpApi(): this;
    startMqttApi(): this;
}

