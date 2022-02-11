import Monitoring from "@monitoring/Monitoring";
import { HealthData } from "@monitoring/HealthData";
import Guid from "@helper/Guid";
import { testData, TestMonitor } from "./TestMonitor";

function processData(data: HealthData) {
    new Monitoring(
        new Guid("device-xyz"),
        new Guid("hospital-treatment-abc"),
        { "test": new TestMonitor() }
    ).healthData(data)
}

describe('When data in range arrived', () => {
    test('should be no errors', () => {
        expect(() => processData(testData("test", "1"))).not.toThrowError()
    });
});
describe('When data out of range arrived', () => {
    test('should be an error', () => {
        expect(() => processData(testData("test", "0"))).toThrowError()
    });
});
describe('When data with unknown type arrived', () => {
    test('should be an error when', () => {
        expect(() => processData(testData("param-x", "10"))).toThrowError()
    });
});