import { EventStoreDBClient, START, streamNameFilter } from "@eventstore/db-client";
import { RedisClientType } from "@node-redis/client/dist/lib/client";

interface ChangeObject<T> {
    (obj: T): Promise<T>
}

export default class HospitalTreatmentsReadService {

    async read(client: EventStoreDBClient, redis: RedisClientType<any>): Promise<void> {
        const subscription = client.subscribeToAll({
            fromPosition: START, filter: streamNameFilter({
                prefixes: ["hospital-treatment-"],
            }),
        })
        for await (const { event } of subscription) {
            if (event === undefined) continue;
            if (event.type === "hospital-treatment-created") {
                await redis.hSet("hospital-treatments", (event as any).data.treatmentId, JSON.stringify({ ...event.data as any, therapies: [] }))
            }

            if (event.type === "therapy-added-to-treatment") {
                await this.changeTreatment(redis, (event as any).data.treatmentId, async (treatment) => {
                    treatment.therapies.push((event as any).data.therapyId)
                    return treatment;
                })
            }
        }
    }

    private async changeTreatment(redis: RedisClientType<any>, id: string, change: ChangeObject<any>) {
        let dataString = await redis.hGet("hospital-treatments", id)
        if (dataString === undefined) return
        await redis.hSet("hospital-treatments", id, JSON.stringify(await change(JSON.parse(dataString))))
    }

}