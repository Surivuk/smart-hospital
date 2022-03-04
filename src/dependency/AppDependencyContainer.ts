import AdminstrationProcessor from '@adminstration/AdminstrationProcessor';
import MockDoctorQueryService from '@adminstration/doctor/MockPatientQueryService';
import MockPatientRepository from '@adminstration/patient/MockPatientRepository';
import MockPatientQueryService from '@app/adminstration/patient/MockPatientQueryService';
import HttpApi from '@app/api/http/HttpApi';
import MqttApi from '@app/api/mqtt/MqttApi';
import MqttConnection from '@common/mqtt/MqttConnection';
import CommandAdapter from '@common/rabbitMq/CommandAdapter';
import DomainEventAdapters from '@common/rabbitMq/DomainEventAdapters';
import { channel, connect } from '@common/rabbitMq/rabbitMq';
import RabbitMqCommandChain from '@common/rabbitMq/RabbitMqCommandChain';
import RabbitMqEventBus from '@common/rabbitMq/RabbitMqEventBus';
import ReadWorker from '@common/ReadWorker';
import { EventStoreDBClient } from '@eventstore/db-client';
import HealthCenterEventHandlers from '@healthCenter/HealthCenterEventHandlers';
import DiastolicBloodPressure from '@healthCenter/healthData/DiastolicBloodPressure';
import PI from '@healthCenter/healthData/PI';
import Pulse from '@healthCenter/healthData/Pulse';
import SPO2 from '@healthCenter/healthData/SPO2';
import SystolicBloodPressure from '@healthCenter/healthData/SystolicBloodPressure';
import Temperature from '@healthCenter/healthData/Temperature';
import HealthStorage from '@healthCenter/HealthStorage';
import DBHealthDataRepository from '@healthCenter/persistance/DBHealthDataRepository';
import ESExaminationRepository from '@medication/examination/persistance/ESExaminationRepository';
import { ExaminationEventStore } from '@medication/examination/persistance/ExaminationEventStore';
import ESHospitalTreatmentRepository from '@medication/hospitalTreatment/persistance/ESHospitalTreatmentRepository';
import { HospitalTreatmentEventStore } from '@medication/hospitalTreatment/persistance/HospitalTreatmentEventStore';
import DBMedicalCardQueryService from '@medication/medicalCard/persistance/DBMedicalCardQueryService';
import ESMedicalCardRepository from '@medication/medicalCard/persistance/ESMedicalCardRepository';
import { MedicalCardEventStore } from '@medication/medicalCard/persistance/MedicalCardEventStore';
import MedicalCardReadWorker from '@medication/medicalCard/persistance/MedicalCardReadWorker';
import MedicationEventHandler from '@medication/MedicationEventHandlers';
import MedicationProcessor from '@medication/MedicationProcessor';
import ESTherapyRepository from '@medication/therapy/persistance/ESTherapyRepository';
import { TherapyEventStore } from '@medication/therapy/persistance/TherapyEventStore';
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

    // EventHandlers
    private _medicationEventHandler!: MedicationEventHandler
    private _monitoringEventHandlers!: MonitoringEventHandlers
    private _healthDataEventHandlers!: HealthCenterEventHandlers

    // ReadWorkers
    private _readWorkers: ReadWorker[] = []

    constructor(private readonly _config: any) { }

    async createDependency(): Promise<this> {
        await this.createChannels();
        const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

        // Repositories
        const patientRepository = new MockPatientRepository()
        const medicalCardRepository = new ESMedicalCardRepository(client, new MedicalCardEventStore())
        const examinationRepository = new ESExaminationRepository(client, new ExaminationEventStore())
        const therapyRepository = new ESTherapyRepository(client, new TherapyEventStore())
        const treatmentRepository = new ESHospitalTreatmentRepository(client, new HospitalTreatmentEventStore())

        const monitoringRepository = new DBMonitoringRepository()
        const healthDataRepository = new DBHealthDataRepository()

        // Processors
        this._adminstrationProcessor = new AdminstrationProcessor(patientRepository, this._eventBus)
        this._medicationProcessor = new MedicationProcessor(medicalCardRepository, examinationRepository, therapyRepository, treatmentRepository, this._eventBus)
        this._monitoringProcessor = new MonitoringProcessor(monitoringRepository, this._eventBus)

        // EventHandlers
        this._medicationEventHandler = new MedicationEventHandler(medicalCardRepository)
        this._monitoringEventHandlers = new MonitoringEventHandlers(monitoringRepository)
        this._healthDataEventHandlers = new HealthCenterEventHandlers(new HealthStorage(healthDataRepository, {
            SPO2: (timestamp, value) => new SPO2(timestamp, parseInt(value)),
            "systolic-blood-pressure": (timestamp, value) => new SystolicBloodPressure(timestamp, parseInt(value)),
            "diastolic-blood-pressure": (timestamp, value) => new DiastolicBloodPressure(timestamp, parseInt(value)),
            PI: (timestamp, value) => new PI(timestamp, parseInt(value)),
            pulse: (timestamp, value) => new Pulse(timestamp, parseInt(value)),
            temperature: (timestamp, value) => new Temperature(timestamp, parseInt(value)),
        }))

        // ReadWorkers
        this._readWorkers.push(new MedicalCardReadWorker(client, new MedicalCardEventStore()))

        this._dependency = {
            mqtt: this._mqtt,
            commandChain: this._commandChain,
            eventBus: this._eventBus,

            // QueryServices
            patientQueryService: new MockPatientQueryService(),
            doctorQueryService: new MockDoctorQueryService(),
            medicalCardQueryService: new DBMedicalCardQueryService()
        }
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
            this._monitoringProcessor
        ].forEach(processor => processor.registerProcesses(this._commandChain))
        return this;
    }
    registerHandlers(): this {
        [
            this._medicationEventHandler,
            this._monitoringEventHandlers,
            this._healthDataEventHandlers
        ].forEach(handler => handler.registerHandlers(this._eventBus))
        return this;
    }
    startHttpApi(): this {
        new HttpApi(this._dependency).start(this._config.port)
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