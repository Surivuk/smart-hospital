import { AggregateRoot } from "@common/AggregateRoot"
import EventStoreEvent from "@common/EventStoreEvent"
import StringField from "@common/fields/StringField"
import Guid from "@common/Guid"
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

    protected apply(event: EventStoreEvent): void {
        if (event instanceof ExaminationCreated) this.applyExaminationCreated(event)
    }

    private applyExaminationCreated(event: ExaminationCreated) {
        this._id = event.examinationId;
    }


} 