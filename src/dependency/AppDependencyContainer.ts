import AdminstrationProcessor from '@adminstration/AdminstrationProcessor';
import MockDoctorQueryService from '@adminstration/doctor/MockPatientQueryService';
import DBPatientQueryService from '@adminstration/patient/DBPatientQueryService';
import DBPatientRepository from '@adminstration/patient/DBPatientRepository';
import MockPatientRepository from '@adminstration/patient/MockPatientRepository';
import DBAlarmNotificationQueryService from '@alarming/perstitance/DBAlarmNotificationQueryService';
import MockPatientQueryService from '@app/adminstration/patient/MockPatientQueryService';
import AlarmingEventHandlers from '@app/alarming/AlarmingEventHandlers';
import AlarmingProcessor from '@app/alarming/AlarmingProcessor';
import DBAlarmNotificationRepository from '@app/alarming/perstitance/DBAlarmNotificationRepository';
import DBAlarmQueryService from '@app/alarming/perstitance/DBAlarmQueryService';
import DBAlarmRepository from '@app/alarming/perstitance/DBAlarmRepository';
import MemoryAlarmRepository from '@app/alarming/perstitance/MemoryAlarmRepository';
import HttpApi from '@app/api/http/HttpApi';
import MqttApi from '@app/api/mqtt/MqttApi';
import NotificationEventHandlers from '@app/notification/NotificationEventHandlers';
import NotificationProcessor from '@app/notification/NotificationProcessor';
import MqttConnection from '@common/mqtt/MqttConnection';
import CommandAdapter from '@common/rabbitMq/CommandAdapter';
import DomainEventAdapters from '@common/rabbitMq/DomainEventAdapters';
import { channel, connect } from '@common/rabbitMq/rabbitMq';
import RabbitMqCommandChain from '@common/rabbitMq/RabbitMqCommandChain';
import RabbitMqEventBus from '@common/rabbitMq/RabbitMqEventBus';
import ReadWorker from '@common/ReadWorker';
import AppSocket from '@common/webSocket/AppSocket';
import { EventStoreDBClient } from '@eventstore/db-client';
import HealthCenterEventHandlers from '@healthCenter/HealthCenterEventHandlers';
import DiastolicBloodPressure from '@healthCenter/healthData/DiastolicBloodPressure';
import PI from '@healthCenter/healthData/PI';
import Pulse from '@healthCenter/healthData/Pulse';
import SPO2 from '@healthCenter/healthData/SPO2';
import SystolicBloodPressure from '@healthCenter/healthData/SystolicBloodPressure';
import Temperature from '@healthCenter/healthData/Temperature';
import HealthStorage from '@healthCenter/HealthStorage';
import DBHealthDataQueryService from '@healthCenter/persistance/DBHealthDataQueryService';
import DBHealthDataRepository from '@healthCenter/persistance/DBHealthDataRepository';
import DBExaminationQueryService from '@medication/examination/persistance/DBExaminationQueryService';
import ESExaminationRepository from '@medication/examination/persistance/ESExaminationRepository';
import { ExaminationEventStore } from '@medication/examination/persistance/ExaminationEventStore';
import ExaminationReadWorker from '@medication/examination/persistance/ExaminationReadWorker';
import DBHospitalTreatmentQueryService from '@medication/hospitalTreatment/persistance/DBHospitalTreatmentQueryService';
import ESHospitalTreatmentRepository from '@medication/hospitalTreatment/persistance/ESHospitalTreatmentRepository';
import { HospitalTreatmentEventStore } from '@medication/hospitalTreatment/persistance/HospitalTreatmentEventStore';
import HospitalTreatmentReadWorker from '@medication/hospitalTreatment/persistance/HospitalTreatmentReadWorker';
import DBMedicalCardQueryService from '@medication/medicalCard/persistance/DBMedicalCardQueryService';
import DBMedicamentQueryService from "@adminstration/medicaments/persistance/DBMedicamentQueryService";
import ESMedicalCardRepository from '@medication/medicalCard/persistance/ESMedicalCardRepository';
import { MedicalCardEventStore } from '@medication/medicalCard/persistance/MedicalCardEventStore';
import MedicalCardReadWorker from '@medication/medicalCard/persistance/MedicalCardReadWorker';
import MedicationEventHandler from '@medication/MedicationEventHandlers';
import MedicationProcessor from '@medication/MedicationProcessor';
import DBTherapyQueryService from '@medication/therapy/persistance/DBTherapyQueryService';
import ESTherapyRepository from '@medication/therapy/persistance/ESTherapyRepository';
import { TherapyEventStore } from '@medication/therapy/persistance/TherapyEventStore';
import TherapyReadWorker from '@medication/therapy/persistance/TherapyReadWorker';
import MonitoringEventHandlers from '@monitoring/MonitoringEventHandlers';
import MonitoringProcessor from '@monitoring/MonitoringProcessor';
import DBMonitoringRepository from '@monitoring/persistance/DBMonitoringRepository';

import DependencyContainer, { Dependency } from './DependencyContainer';


export default class AppDependencyContainer implements DependencyContainer {
    private _dependency!: Dependency

    private _mqtt!: MqttConnection
    private _commandChain!: RabbitMqCommandChain
    private _eventBus!: RabbitMqEventBus

    // Processors
    private _adminstrationProcessor!: AdminstrationProcessor
    private _medicationProcessor!: MedicationProcessor
    private _monitoringProcessor!: MonitoringProcessor
    private _alarmingProcessor!: AlarmingProcessor
    private _notificationProcessor!: NotificationProcessor;

    // EventHandlers
    private _medicationEventHandler!: MedicationEventHandler
    private _monitoringEventHandlers!: MonitoringEventHandlers
    private _healthDataEventHandlers!: HealthCenterEventHandlers
    private _alarmingEventHandlers!: AlarmingEventHandlers
    private _notificationEventHandlers!: NotificationEventHandlers

    // ReadWorkers
    private _readWorkers: ReadWorker[] = []

    private _webSocket!: AppSocket;
    private _httpServer!: HttpApi;

    constructor(private readonly _config: any) { }

    async createDependency(): Promise<this> {
        await this.createChannels();
        const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

        this._dependency = {
            mqtt: this._mqtt,
            commandChain: this._commandChain,
            eventBus: this._eventBus,

            // QueryServices
            patientQueryService: new DBPatientQueryService(),
            doctorQueryService: new MockDoctorQueryService(),
            medicalCardQueryService: new DBMedicalCardQueryService(),
            healthDataQueryService: new DBHealthDataQueryService(),
            alarmQueryService: new DBAlarmQueryService(),
            therapyQueryService: new DBTherapyQueryService(),
            hospitalTreatmentQueryService: new DBHospitalTreatmentQueryService(),
            alarmNotificationQueryService: new DBAlarmNotificationQueryService(),
            examinationQueryService: new DBExaminationQueryService(),
            medicamentQueryService: new DBMedicamentQueryService()
        }

        this._httpServer = new HttpApi(this._dependency)
        this._webSocket = new AppSocket(this._httpServer.io);

        // Repositories
        const patientRepository = new DBPatientRepository()
        const medicalCardRepository = new ESMedicalCardRepository(client, new MedicalCardEventStore())
        const examinationRepository = new ESExaminationRepository(client, new ExaminationEventStore())
        const therapyRepository = new ESTherapyRepository(client, new TherapyEventStore())
        const treatmentRepository = new ESHospitalTreatmentRepository(client, new HospitalTreatmentEventStore())

        const monitoringRepository = new DBMonitoringRepository()
        const healthDataRepository = new DBHealthDataRepository()
        const alarmRepository = new MemoryAlarmRepository(new DBAlarmRepository())
        const alarmNotificationRepository = new DBAlarmNotificationRepository()

        // Processors
        this._adminstrationProcessor = new AdminstrationProcessor(patientRepository, this._eventBus)
        this._medicationProcessor = new MedicationProcessor(medicalCardRepository, examinationRepository, therapyRepository, treatmentRepository, this._eventBus)
        this._monitoringProcessor = new MonitoringProcessor(monitoringRepository, this._eventBus)
        this._alarmingProcessor = new AlarmingProcessor(this._eventBus, alarmRepository);
        this._notificationProcessor = new NotificationProcessor();

        // EventHandlers
        this._medicationEventHandler = new MedicationEventHandler(medicalCardRepository)
        this._monitoringEventHandlers = new MonitoringEventHandlers(monitoringRepository)
        this._healthDataEventHandlers = new HealthCenterEventHandlers(new HealthStorage(healthDataRepository, {
            SPO2: (timestamp, value) => new SPO2(timestamp, parseInt(value)),
            "systolic-blood-pressure": (timestamp, value) => new SystolicBloodPressure(timestamp, parseInt(value)),
            "diastolic-blood-pressure": (timestamp, value) => new DiastolicBloodPressure(timestamp, parseInt(value)),
            PI: (timestamp, value) => new PI(timestamp, parseFloat(value)),
            pulse: (timestamp, value) => new Pulse(timestamp, parseInt(value)),
            temperature: (timestamp, value) => new Temperature(timestamp, parseFloat(value)),
        }))
        this._alarmingEventHandlers = new AlarmingEventHandlers(alarmRepository, alarmNotificationRepository)
        this._notificationEventHandlers = new NotificationEventHandlers(this._webSocket, this._dependency.alarmQueryService)

        // ReadWorkers
        this._readWorkers.push(new MedicalCardReadWorker(client, new MedicalCardEventStore()))
        this._readWorkers.push(new HospitalTreatmentReadWorker(client))
        this._readWorkers.push(new TherapyReadWorker(client))
        this._readWorkers.push(new ExaminationReadWorker(client))


        return this;
    }

    private async createChannels() {
        this._mqtt = new MqttConnection("mqtt://localhost")
        const connection = await connect("amqp://localhost")
        const serverChannel = await channel(connection)
        const clientChannel = await channel(connection)

        this._commandChain = new RabbitMqCommandChain(serverChannel, clientChannel, new CommandAdapter());
        this._eventBus = new RabbitMqEventBus(clientChannel, new DomainEventAdapters());

        await this._commandChain.start();
        await this._eventBus.start();
    }

    registerProcesses(): this {
        [
            this._adminstrationProcessor,
            this._medicationProcessor,
            this._monitoringProcessor,
            this._alarmingProcessor,
            this._notificationProcessor
        ].forEach(processor => processor.registerProcesses(this._commandChain))
        return this;
    }
    registerHandlers(): this {
        [
            this._medicationEventHandler,
            this._monitoringEventHandlers,
            this._healthDataEventHandlers,
            this._alarmingEventHandlers,
            this._notificationEventHandlers
        ].forEach(handler => handler.registerHandlers(this._eventBus))
        return this;
    }
    startHttpApi(): this {
        this._httpServer.start(this._config.port)
        return this;
    }
    startReadWorkers(): this {
        this._readWorkers.forEach(worker => worker.work())
        return this;
    }
    startMqttApi(): this {
        new MqttApi(this._dependency).start()
        return this;
    }
}