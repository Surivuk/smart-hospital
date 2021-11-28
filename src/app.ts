import { EventStoreDBClient } from "@eventstore/db-client";
import Guid, { GuidFactory } from "@helper/Guid";
import CommandChain from "./CommandChain";
import ConsumptionFrequency from "./medication/ConsumptionFrequency";
import ConsumptionRoute from "./medication/ConsumptionRoute";
import MedicationConsumption from "./medication/MedicationConsumption";
import ESTherapyRepository from "./therapy/persistance/ESTherapyRepository";
import { TherapyEventStore } from "./therapy/persistance/TherapyEventStore";
import { AddMedicationToTherapy, CreateTherapy } from "./therapy/TherapyCommands";
import TherapyProcessors from "./therapy/TherapyProcessors";

const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

const repo = new ESTherapyRepository(client, new TherapyEventStore())
const processors = new TherapyProcessors(repo);

const chain = new CommandChain();
processors.register(chain)


async function main() {
    // chain.process(new CreateTherapy([new MedicationConsumption(
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
    chain.process(new AddMedicationToTherapy(new Guid("cf4b3a188b6e412f979641cc6f62c9e1"), new MedicationConsumption(
            GuidFactory.guid(),
            100,
            4,
            ConsumptionRoute.create("PO (by mouth)"),
            ConsumptionFrequency.create("four times a day")
        )))
}

main().catch((err) => console.log(err))
