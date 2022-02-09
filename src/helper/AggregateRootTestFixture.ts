import { AggregateRoot } from "./AggregateRoot";
import EventStoreEvent from "./EventStoreEvent"

export interface AggregateRootTestFixtureMethods<T extends AggregateRoot> {
    root(): T;
    given(): EventStoreEvent[];
    when(root: T): void;
}
export type TestFixtureResult = {
    events: EventStoreEvent[],
    error?: Error
}
export function aggregateRootTestFixture<T extends AggregateRoot>({ root: createRoot, given, when }: AggregateRootTestFixtureMethods<T>): TestFixtureResult {
    let error: Error | undefined
    const root = createRoot();
    root.loadsFromHistory(given());
    try {
        when(root)
    }
    catch (err) {
        error = err
    }
    return { events: Array.from(root.uncommittedChanges()), error }
}
