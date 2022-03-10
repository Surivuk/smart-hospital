import KnexConnector from '@common/db/KnexConnector';
import ReadWorker from '@common/ReadWorker';
import {
    AllStreamRecordedEvent,
    EventStoreDBClient,
    eventTypeFilter,
    persistentSubscriptionToAllSettingsFromDefaults,
    START,
} from '@eventstore/db-client';


export default class HospitalTreatmentReadWorker extends KnexConnector implements ReadWorker {

    private readonly _groupName: string = "hospital-treatment";

    constructor(
        private readonly _client: EventStoreDBClient
    ) { super() }

    async work(): Promise<void> {
        try {
            try {
                // await this._client.deletePersistentSubscriptionToAll(this._groupName)
                await this._client.getPersistentSubscriptionToAllInfo(this._groupName)
            } catch (error) {
                await this._client.createPersistentSubscriptionToAll(this._groupName,
                    { ...persistentSubscriptionToAllSettingsFromDefaults(), startFrom: START },
                    {
                        filter: eventTypeFilter({
                            prefixes: [
                                "hospital-treatment-created",
                                "therapy-added-to-treatment",
                                "therapy-removed-from-treatment",
                                "hospital-treatment-closed"
                            ]
                        })
                    }
                )
            }
            const subscription = this._client.subscribeToPersistentSubscriptionToAll(this._groupName)

            try {
                for await (const event of subscription) {
                    if (!event.event) continue;
                    await this.handleEvent(event.event)
                    await subscription.ack(event);
                }
            } catch (error) {
                console.log(`Subscription was dropped. ${error}`);
            }
        } catch (error) {
            console.log(`[HospitalTreatmentReadWorker] - ${error.message}`)
        }
    }

    private async handleEvent(event: AllStreamRecordedEvent) {
        try {
            const id = event.streamId.split("hospital-treatment-")[1]
            if (event.type === "hospital-treatment-created") await this.treatmentCreated(id, event.data);
            if (event.type === "therapy-added-to-treatment") await this.therapyAdded(id, event.data);
            if (event.type === "therapy-removed-from-treatment") await this.therapyRemoved(id, event.data);
            if (event.type === "hospital-treatment-closed") await this.treatmentClosed(id, event.data);
        } catch (error) {
            console.log(`[READ WORKER] - [HospitalTreatmentReadWorker] - ${error.message}`)
        }

    }
    private async treatmentCreated(id: string, data: any) {
        return this.knex("hospital_treatment").insert({ id: id, medical_card: data.medicalCardId, created_at: this.knex.fn.now() })
    }
    private async therapyAdded(id: string, data: any) {
        return this.knex("hospital_treatment_therapies").insert({ therapy: data.therapyId, hospital_treatment: id, created_at: this.knex.fn.now() })
    }
    private async therapyRemoved(id: string, data: any) {
        return this.knex("hospital_treatment_therapies").where({ therapy: data.therapyId, hospital_treatment: id }).delete()
    }
    private async treatmentClosed(id: string, data: any) {
        return this.knex("hospital_treatment").update({ closed: true, closed_at: this.knex.fn.now() }).where({ id: id })
    }
}
