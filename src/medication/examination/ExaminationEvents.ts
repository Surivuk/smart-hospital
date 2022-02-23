import EventStoreEvent from "@common/EventStoreEvent";
import StringField from "@common/fields/StringField";
import Guid from "@common/Guid";

export class ExaminationCreated implements EventStoreEvent {
    constructor(public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly diagnose: StringField) { }
}
export class NoteAddedToExamination implements EventStoreEvent {
    constructor(public readonly examinationId: Guid, public readonly doctorId: Guid, public readonly note: StringField) { }
}