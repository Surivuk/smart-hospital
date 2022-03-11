import Config from './config/Config';
import AppDependencyContainer from './dependency/AppDependencyContainer';

async function main() {
    const dependencyContainer = new AppDependencyContainer(new Config(process.env).config);
    (await dependencyContainer.createDependency())
        .startReadWorkers()
        .registerHandlers()
        .registerProcesses()
        .startHttpApi()
        .startMqttApi()

}

main()
    .then(() => { console.log("[APPLICATION] Started") })
    .catch((err) => console.log("[APPLICATION]", err))




