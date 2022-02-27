import AppDependencyContainer from './dependency/AppDependencyContainer';

async function main() {
    const dependencyContainer = new AppDependencyContainer({ port: 9000 });
    (await dependencyContainer.createDependency())
        .startReadWorkers()
        .registerHandlers()
        .registerProcesses()
        .startHttpApi()

}
main()
    .then(() => { console.log("[APPLICATION] Started") })
    .catch((err) => console.log(err))


