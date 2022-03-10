import KnexConnector from '@common/db/KnexConnector';
import EventStoreEvent from '@common/EventStoreEvent';
import ReadWorker from '@common/ReadWorker';
import { AllStreamRecordedEvent, EventStoreDBClient, eventTypeFilter, FORWARDS, persistentSubscriptionToAllSettingsFromDefaults, START } from '@eventstore/db-client';

import MedicalCard from '../MedicalCard';
import { MedicalCardEvents, MedicalCardEventStore } from './MedicalCardEventStore';

export default class MedicalCardReadWorker extends KnexConnector implements ReadWorker {

    private readonly _groupName: string = "medical-card";

    constructor(
        private readonly _client: EventStoreDBClient,
        private readonly _eventStore: MedicalCardEventStore
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
                                "medical-card-created",
                                "treatment-noted-to-medical-card",
                                "examination-noted-to-medical-card",
                                "therapy-noted-to-medical-card"
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
            console.log(`[MedicalCardReadWorker] - ${error.message}`)
        }
    }

    private async handleEvent(event: AllStreamRecordedEvent) {
        try {
            const id = event.streamId.split("medical-card-")[1]
            if (event.type === "medical-card-created") await this.createMedicalCard(id, event.data);
            if (event.type === "treatment-noted-to-medical-card") await this.noteTreatment(id, event.data);
            if (event.type === "examination-noted-to-medical-card") await this.noteExamination(id, event.data);
            if (event.type === "therapy-noted-to-medical-card") await this.noteTherapy(id, event.data);
        } catch (error) {
            console.log(`[READ WORKER] - [MedicalCardReadWorker] - ${error.message}`)
        }

    }
    private async createMedicalCard(id: string, data: any) {
        return this.knex("medical_card").insert({ id: id, created_at: this.knex.fn.now() })
    }
    private async noteTreatment(id: string, data: any) {
        return this.knex("noted_events").insert({ medical_card: id, type: "TREATMENT", event_id: data.treatmentId, created_at: this.knex.fn.now() })
    }
    private async noteExamination(id: string, data: any) {
        return this.knex("noted_events").insert({ medical_card: id, type: "EXAMINATION", event_id: data.examinationId, created_at: this.knex.fn.now() })
    }
    private async noteTherapy(id: string, data: any) {
        return this.knex("noted_events").insert({ medical_card: id, type: "THERAPY", event_id: data.therapyId, created_at: this.knex.fn.now() })
    }






    private async mm() {
        const events = this._client.readStream<MedicalCardEvents>('', { direction: FORWARDS, fromRevision: START })
        const medicalCard = new MedicalCard();
        const readEvents: EventStoreEvent[] = []
        for await (const resolvedEvent of events) {
            if (!resolvedEvent.event) continue
            readEvents.push(this._eventStore.event(resolvedEvent.event))
        }
        medicalCard.loadsFromHistory(readEvents)
        return medicalCard;
    }

}
