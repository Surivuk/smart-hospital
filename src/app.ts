import { EventStoreDBClient } from "@eventstore/db-client";
import Guid, { GuidFactory } from "@helper/Guid";
import CommandChain from "./CommandChain";
import { AddTherapyToTreatment, CreateHospitalTreatment } from "./hospitalTreatment/HospitalTreatmentCommands";
import HospitalTreatmentProcessors from "./hospitalTreatment/HospitalTreatmentProcessors";
import ESHospitalTreatmentRepository from "./hospitalTreatment/persistance/ESHospitalTreatmentRepository";
import { HospitalTreatmentEventStore } from "./hospitalTreatment/persistance/HospitalTreatmentEventStore";
import ConsumptionFrequency from "./medication/ConsumptionFrequency";
import ConsumptionRoute from "./medication/ConsumptionRoute";
import MedicationConsumption from "./medication/MedicationConsumption";
import ESTherapyRepository from "./therapy/persistance/ESTherapyRepository";
import { TherapyEventStore } from "./therapy/persistance/TherapyEventStore";
import { AddMedicationToTherapy, CreateTherapy } from "./therapy/TherapyCommands";
import TherapyProcessors from "./therapy/TherapyProcessors";

const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

const MEDICAL_CARD = new Guid("0a710cab-576b-4263-bf70-40e2ff203489");
const DOCTOR = new Guid("3c3c4f8f-4cd0-4dc6-876c-9846643df8e9");


const repo = new ESTherapyRepository(client, new TherapyEventStore())
const processors = new TherapyProcessors(repo);
const treatmentProcessors = new HospitalTreatmentProcessors(new ESHospitalTreatmentRepository(client, new HospitalTreatmentEventStore()))

const chain = new CommandChain();
processors.register(chain)
treatmentProcessors.register(chain)


async function main() {
    // chain.process(new CreateTherapy(MEDICAL_CARD, [new MedicationConsumption(
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
