import AdminstrationProcessor from '@adminstration/AdminstrationProcessor';
import MockDoctorQueryService from '@adminstration/doctor/MockPatientQueryService';
import MockPatientRepository from '@adminstration/patient/MockPatientRepository';
import MockPatientQueryService from '@app/adminstration/patient/MockPatientQueryService';
import HttpApi from '@app/api/http/HttpApi';
import CommandAdapter from '@common/rabbitMq/CommandAdapter';
import DomainEventAdapters from '@common/rabbitMq/DomainEventAdapters';
import { channel, connect } from '@common/rabbitMq/rabbitMq';
import RabbitMqCommandChain from '@common/rabbitMq/RabbitMqCommandChain';
import RabbitMqEventBus from '@common/rabbitMq/RabbitMqEventBus';
import ReadWorker from '@common/ReadWorker';
import { EventStoreDBClient } from '@eventstore/db-client';
import DBMedicalCardQueryService from '@medication/medicalCard/persistance/DBMedicalCardQueryService';
import ESMedicalCardRepository from '@medication/medicalCard/persistance/ESMedicalCardRepository';
import { MedicalCardEventStore } from '@medication/medicalCard/persistance/MedicalCardEventStore';
import MedicalCardReadWorker from '@medication/medicalCard/persistance/MedicalCardReadWorker';
import MedicationEventHandler from '@medication/MedicationEventHandlers';

import DependencyContainer, { Dependency } from './DependencyContainer';


export default class AppDependencyContainer implements DependencyContainer {
    private _dependency!: Dependency

    private _commandChain!: RabbitMqCommandChain
    private _eventBus!: RabbitMqEventBus

    // Processors
    private _adminstrationProcessor!: AdminstrationProcessor

    // EventHandlers
    private _medicationEventHandler!: MedicationEventHandler

    // ReadWorkers
    private _readWorkers: ReadWorker[] = []

    constructor(private readonly _config: any) { }

    async createDependency(): Promise<this> {
        await this.createChannels();
        const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

        // Repositories
        const patientRepository = new MockPatientRepository()
        const MedicalCardRepository = new ESMedicalCardRepository(client, new MedicalCardEventStore())

        // Processors
        this._adminstrationProcessor = new AdminstrationProcessor(patientRepository, this._eventBus)

        // EventHandlers
        this._medicationEventHandler = new MedicationEventHandler(MedicalCardRepository)

        // ReadWorkers
        this._readWorkers.push(new MedicalCardReadWorker(client, new MedicalCardEventStore()))

        this._dependency = {
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
            this._adminstrationProcessor
        ].forEach(processor => processor.registerProcesses(this._commandChain))
        return this;
    }
    registerHandlers(): this {
        [
            this._medicationEventHandler
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

}