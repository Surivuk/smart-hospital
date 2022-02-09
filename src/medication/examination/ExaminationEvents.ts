import EventStoreEvent from "@helper/EventStoreEvent";
import StringField from "@helper/fields/StringField";
import Guid from "@helper/Guid";

export class ExaminationCreated implements EventStoreEvent {
    constructor(public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly diagnose: StringField) { }
}
export class NoteAddedToExamination implements EventStoreEvent {
    constructor(public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly note: StringField) { }
}