import { EventStoreDBClient } from "@eventstore/db-client";
import Guid, { GuidFactory } from "@helper/Guid";
import CommandChain, { TestCommandChain } from "./CommandChain";
import EventBus from "./EventBus";

import ESHospitalTreatmentRepository from "./medication/hospitalTreatment/persistance/ESHospitalTreatmentRepository";
import { HospitalTreatmentEventStore } from "./medication/hospitalTreatment/persistance/HospitalTreatmentEventStore";
import ConsumptionFrequency from "./medication/medicamentConsumption/ConsumptionFrequency";
import ConsumptionRoute from "./medication/medicamentConsumption/ConsumptionRoute";
import MedicamentConsumption from "./medication/medicamentConsumption/MedicamentConsumption";
import HospitalTreatmentsReadService from "./medication/hospitalTreatment/HospitalTreatmentsReadService";
import ESTherapyRepository from "./medication/therapy/persistance/ESTherapyRepository";
import { TherapyEventStore } from "./medication/therapy/persistance/TherapyEventStore";
import { AddMedicationToTherapy, CreateTherapy } from "./medication/therapy/TherapyCommands";
import TherapyProcessors from "./medication/therapy/TherapyProcessors";
import { createClient } from "redis"
import { channel, connect } from "@helper/rabbitMq/rabbitMq";
import RabbitMqEventBus from "@helper/rabbitMq/RabbitMqEventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";
import DomainEventAdapters from "@helper/rabbitMq/DomainEventAdapters";
import RabbitMqCommandChain from "@helper/rabbitMq/RabbitMqCommandChain";
import CommandAdapter from "@helper/rabbitMq/CommandAdapter";
import AddExample from "./commands/Commands";
import NormalStringField from "@helper/fields/NormalStringField";
import NotEmptyStringField from "@helper/fields/NotEmptyStringField";


const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")



const MEDICAL_CARD = new Guid("0a710cab-576b-4263-bf70-40e2ff203489");
const DOCTOR = new Guid("3c3c4f8f-4cd0-4dc6-876c-9846643df8e9");

// const eventBus = new EventBus()

const repo = new ESTherapyRepository(client, new TherapyEventStore())
const treatmentRepo = new ESHospitalTreatmentRepository(client, new HospitalTreatmentEventStore())
// const processors = new TherapyProcessors(repo, eventBus);
// const treatmentProcessors = new HospitalTreatmentProcessors(treatmentRepo)
// const treatmentHandlers = new HospitalTreatmentEventHandlers(treatmentRepo)

// treatmentHandlers.register(eventBus)

const chain = new TestCommandChain();
// processors.register(chain)
// treatmentProcessors.register(chain)

const redisClient = createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function main() {

    const connection = await connect("amqp://localhost")
    const serverChannel = await channel(connection)
    const clientChannel = await channel(connection)

    // const bus = new RabbitMqEventBus(aChannel, new DomainEventAdapters())
    // await bus.start()

    // bus.on(HealthDataReceived.name, async (event) => {
    //     console.log(event)
    // })

    // let counter = 0
    // let int = setInterval(() => {
    //     bus.emit(new HealthDataReceived(new Guid("treatment-123"), { type: "saturation", value: "99", timestamp: new Date().getTime() }))
    //     if (counter === 0) {
    //         clearInterval(int)
    //         return;
    //     } counter--
    // }, 1000)


    const chain = new RabbitMqCommandChain(serverChannel, clientChannel, new CommandAdapter())
    await chain.start()

    console.log("Started...")

    chain.registerProcessor<AddExample>("AddExample", async (command) => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log("TICK")
                resolve()
            }, 1000 * 3)
        })
        // console.log("WORKED")
        // throw new Error("FAKE")
    })

    try {
        await chain.process(new AddExample(new Guid("1"), NotEmptyStringField.create("Example name")))
        console.log("Success", "DONE")
    } catch (error) {
        console.log("Error", error.message)
    }





    // await redisClient.connect();
    // new HospitalTreatmentsReadService().read(client, redisClient)


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


