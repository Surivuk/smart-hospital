import { EventStoreDBClient } from "@eventstore/db-client";
import Guid, { GuidFactory } from "@helper/Guid";
import CommandChain from "./CommandChain";
import EventBus from "./EventBus";

import ESHospitalTreatmentRepository from "./medication/hospitalTreatment/persistance/ESHospitalTreatmentRepository";
import { HospitalTreatmentEventStore } from "./medication/hospitalTreatment/persistance/HospitalTreatmentEventStore";
import ConsumptionFrequency from "./medication/medicamentConsumtion/ConsumptionFrequency";
import ConsumptionRoute from "./medication/medicamentConsumtion/ConsumptionRoute";
import MedicamentConsumption from "./medication/medicamentConsumtion/MedicamentConsumption";
import HospitalTreatmentsReadService from "./services/HospitalTreatmentsReadService";
import ESTherapyRepository from "./medication/therapy/persistance/ESTherapyRepository";
import { TherapyEventStore } from "./medication/therapy/persistance/TherapyEventStore";
import { AddMedicationToTherapy, CreateTherapy } from "./medication/therapy/TherapyCommands";
import TherapyProcessors from "./medication/therapy/TherapyProcessors";
import { createClient } from "redis"

const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")



const MEDICAL_CARD = new Guid("0a710cab-576b-4263-bf70-40e2ff203489");
const DOCTOR = new Guid("3c3c4f8f-4cd0-4dc6-876c-9846643df8e9");

const eventBus = new EventBus()

const repo = new ESTherapyRepository(client, new TherapyEventStore())
const treatmentRepo = new ESHospitalTreatmentRepository(client, new HospitalTreatmentEventStore())
const processors = new TherapyProcessors(repo, eventBus);
// const treatmentProcessors = new HospitalTreatmentProcessors(treatmentRepo)
// const treatmentHandlers = new HospitalTreatmentEventHandlers(treatmentRepo)

// treatmentHandlers.register(eventBus)

const chain = new CommandChain();
processors.register(chain)
// treatmentProcessors.register(chain)

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function main() {
    await redisClient.connect();
    new HospitalTreatmentsReadService().read(client, redisClient)


    // await chain.process(new CreateHospitalTreatment(MEDICAL_CARD, DOCTOR))
    // await chain.process(new CreateTherapy(new Guid("ce2fbb515db8f4361b6d594b9f730efd"), [new MedicationConsumption(
    //     GuidFactory.guid(),
    //     500,
    //     2,
    //     ConsumptionRoute.create("PO (by mouth)"),
    //     ConsumptionFrequency.create("twice a day")
    // ), new MedicationConsumption(
    //     GuidFactory.guid(),
    //     1000,
    //     1,
    //     ConsumptionRoute.create("PO (by mouth)"),
    //     ConsumptionFrequency.create("daily")
    // )]))
    // chain.process(new AddMedicationToTherapy(new Guid("cf4b3a188b6e412f979641cc6f62c9e1"), new MedicationConsumption(
    //         GuidFactory.guid(),
    //         100,
    //         4,
    //         ConsumptionRoute.create("PO (by mouth)"),
    //         ConsumptionFrequency.create("four times a day")
    //     )))
    // chain.process(new CreateHospitalTreatment(MEDICAL_CARD, DOCTOR))
    // chain.process(new AddTherapyToTreatment(new Guid("f7871cdc677184fc073618d7f180a67d"), new Guid("cf4b3a188b6e412f979641cc6f62c9e1")))
}

main().catch((err) => console.log(err))


