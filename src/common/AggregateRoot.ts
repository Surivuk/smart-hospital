import Guid from "./Guid";
import EventStoreEvent from "./EventStoreEvent";

export abstract class AggregateRoot {
    private readonly _changes: EventStoreEvent[] = [];

    protected _id!: Guid;
    private _revision: BigInt = BigInt(0);

    set revision(nextRevision: BigInt) {
        if (nextRevision < this._revision)
            throw new Error(`Revision problem! Current: ${this._revision}, New: ${nextRevision}`)
        this._revision = nextRevision;
    }
    get revision() {
        return this._revision
    }
    get id() {
        return this._id;
    }

    uncommittedChanges(): EventStoreEvent[] {
        return this._changes.slice();
    }
    markChangesAsCommitted() {
        while (this._changes.length !== 0)
            this._changes.pop();
    }
    loadsFromHistory(history: EventStoreEvent[]) {
        for (const e of history)
            this.applyChangeBase(e, false);
    }

    protected applyChange(event: EventStoreEvent) {
        this.applyChangeBase(event, true);
    }
    private applyChangeBase(event: EventStoreEvent, isNew: boolean) {
        this.apply(event);
        if (isNew)
            this._changes.push(event);
    }

    protected abstract apply(event: EventStoreEvent): void;
}
