import EventBus, { TestEventBus } from "@app/EventBus";
import { HealthDataReceived } from "@events/MonitoringEvents";
import Guid from "@common/Guid";
import Monitoring from "@monitoring/Monitoring";
import MonitoringCommandProcessor from "@monitoring/MonitoringCommandProcessor";
import MockMonitoringRepository from "./MockMonitoringRepository";
import { testData, TestMonitor } from "./TestMonitor";

const DEVICE_ID = new Guid("device-xyz");
const TREATMENT_ID = new Guid("treatment-aaa");

function monitoringProcessor(repo: MockMonitoringRepository, bus: TestEventBus) {
    return new MonitoringCommandProcessor(repo, bus)
}

describe('When valid monitoring data processed', () => {

    const monitoringRepo = new MockMonitoringRepository();
    const eventBus = new TestEventBus();

    let error: Error | undefined;
    let event: HealthDataReceived | undefined;

    beforeAll(async () => {
        monitoringRepo.setMonitoring(new Monitoring(DEVICE_ID, TREATMENT_ID, { "test": new TestMonitor() }))
        eventBus.on<HealthDataReceived>("HealthDataReceived", async (data) => {
            event = data
        })

        try {
            await monitoringProcessor(monitoringRepo, eventBus).processHealthData(DEVICE_ID, testData("test", "1"))
        } catch (err) {
            error = err
        }
    })

    test('should not throw an error', () => {
        expect(error).toBeUndefined();
    });
    test('should emit an event with treatment id', () => {
        expect(event?.treatmentId.equals(TREATMENT_ID)).toBe(true);
    });
});