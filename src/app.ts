import { EventStoreDBClient } from '@eventstore/db-client';

import HttpApi from './api/http/HttpApi';
import AppDependencyContainer from './dependency/AppDependencyContainer';
import DependencyContainer from './dependency/DependencyContainer';


const client = EventStoreDBClient.connectionString("esdb://127.0.0.1:2113?tls=false")

const dependencyContainer: DependencyContainer = new AppDependencyContainer()

async function main() {
    const dependency = await dependencyContainer.dependency()

    dependencyContainer.registerEventHandlers();
    dependencyContainer.registerProcesses();

    new HttpApi(dependency).start(9000)
}

main().catch((err) => console.log(err))


