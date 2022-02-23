import { EventStoreDBClient } from '@eventstore/db-client';

import AppDependencyContainer from './dependency/AppDependencyContainer';

const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

async function main() {
    const dependencyContainer = new AppDependencyContainer({ port: 9000 });
    (await dependencyContainer.createDependency())
        .registerHandlers()
        .registerProcesses()
        .startHttpApi()
}

main()
    .then(() => { console.log("[APPLICATION] Started") })
    .catch((err) => console.log(err))


