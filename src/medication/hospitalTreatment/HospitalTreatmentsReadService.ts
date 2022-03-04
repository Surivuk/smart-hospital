import {
    HospitalTreatmentCreatedEvent,
    TherapyAddedToHospitalTreatmentEvent,
} from '@app/medication/hospitalTreatment/persistance/HospitalTreatmentEventStore';
import { EventStoreDBClient, START, streamNameFilter } from '@eventstore/db-client';
import { RedisClientType } from '@node-redis/client/dist/lib/client';

class HospitalTreatment {
    public treatmentId: string;
    public medicalCardId: string;
    public therapies: string[];

    constructor(data: {
        treatmentId: string,
        medicalCardId: string,
        therapies: string[]
    }) {
        this.treatmentId = data.treatmentId;
        this.medicalCardId = data.medicalCardId;
        this.therapies = data.therapies;
    }

}
interface ChangeObject {
    (obj: HospitalTreatment): Promise<HospitalTreatment>
}
interface Handler {
    (redis: RedisClientType<any>, event: any): Promise<void>
}

export default class HospitalTreatmentsReadService {

    private readonly _handlers: Map<string, Handler> = new Map();

    constructor() {
        this._handlers
            .set("hospital-treatment-created", async (redis, { data }: HospitalTreatmentCreatedEvent) => {
                await redis.hSet("hospital-treatments", data.treatmentId, JSON.stringify(new HospitalTreatment({ ...data, therapies: [] })))
            })
            .set("therapy-added-to-treatment", async (redis, { data }: TherapyAddedToHospitalTreatmentEvent) => {
                await this.changeTreatment(redis, data.treatmentId, async (treatment) => {
                    treatment.therapies.push(data.therapyId)
                    return treatment;
                })
            })
    }

    async read(client: EventStoreDBClient, redis: RedisClientType<any>): Promise<void> {
        const subscription = client.subscribeToAll({
            fromPosition: START, filter: streamNameFilter({
                prefixes: ["hospital-treatment-"],
            }),
        })
        for await (const { event } of subscription) {
            if (event === undefined) continue;
            const handler = this._handlers.get(event.type)
            if (handler === undefined) continue;
            await handler(redis, event)
        }
    }

    private async changeTreatment(redis: RedisClientType<any>, id: string, change: ChangeObject) {
        let dataString = await redis.hGet("hospital-treatments", id)
        if (dataString === undefined) return
        await redis.hSet("hospital-treatments", id, JSON.stringify(await change(JSON.parse(dataString) as HospitalTreatment)))
    }
}