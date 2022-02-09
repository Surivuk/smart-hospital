import { AggregateRoot } from "@helper/AggregateRoot"
import EventStoreEvent from "@helper/EventStoreEvent"
import StringField from "@helper/fields/StringField"
import Guid from "@helper/Guid"
import { ExaminationCreated, NoteAddedToExamination } from "./ExaminationEvents"

export class ExaminationError extends Error {
    constructor(message: string) {
        super(`[Examination] Error - ${message}`);
    }
}

export default class Examination extends AggregateRoot {

    public static create(id: Guid, doctorId: Guid, diagnose: StringField): Examination {
        const result = new Examination()
        result.applyChange(new ExaminationCreated(id, doctorId, diagnose))
        return result
    }

    addNote(note: StringField, doctorId: Guid) {
        this.applyChange(new NoteAddedToExamination(this._id, doctorId, note))
    }

    protected apply(event: EventStoreEvent): void { }


} 