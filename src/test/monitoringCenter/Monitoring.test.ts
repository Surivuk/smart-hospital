import Monitoring, { ReadData } from "@app/monitoringCenter/Monitoring";
import { AddedMonitoredValue } from "@app/monitoringCenter/MonitoringEvents";

function timestamp(plusSecond?: number): number {
    const date = new Date();
    if (plusSecond) date.setSeconds(date.getSeconds() + plusSecond)
    return date.getTime()
}
const record = (timestamp: number, type: string, value: string): ReadData => ({ timestamp, values: [{ value, type }] })
const event = (monitoring: Monitoring, index: number) => (monitoring.uncommittedChanges()[index] as AddedMonitoredValue).value;

describe('When monitoring processed recorded values which are in normal range', () => {
    const monitoring: Monitoring = new Monitoring()

    beforeAll(() => {
        [
            record(timestamp(), "saturation", "96"),
            record(timestamp(10), "saturation", "97"),
            record(timestamp(60), "saturation", "98"),
            record(timestamp(70), "saturation", "99"),
        ]
            .forEach(record => monitoring.processData(record))
    })

    test('should be two stored values', () => {
        expect(monitoring.uncommittedChanges().length).toBe(2)
    });
    test('should be saturation record with 96 value', () => {
        const e = event(monitoring, 0);
        expect(e.type()).toBe("saturation")
        expect(e.toString()).toBe("96")
        expect(e.isNormal()).toBe(true)
    });
    test('should be saturation record with 97 value', () => {
        const e = event(monitoring, 1);
        expect(e.type()).toBe("saturation")
        expect(e.toString()).toBe("98")
        expect(e.isNormal()).toBe(true)
    });
});
describe('When monitoring processed recorded values which are in warning range', () => {
    const monitoring: Monitoring = new Monitoring()

    beforeAll(() => {
        [
            record(timestamp(), "saturation", "91"),
            record(timestamp(5), "saturation", "92"),
            record(timestamp(10), "saturation", "93"),
            record(timestamp(15), "saturation", "94"),
        ]
            .forEach(record => monitoring.processData(record))
    })

    test('should be two stored values', () => {
        expect(monitoring.uncommittedChanges().length).toBe(2)
    });
    test('should be saturation record with 91 value', () => {
        const e = event(monitoring, 0);
        expect(e.type()).toBe("saturation")
        expect(e.toString()).toBe("91")
        expect(e.isWarning()).toBe(true)
    });
    test('should be saturation record with 93 value', () => {
        const e = event(monitoring, 1);
        expect(e.type()).toBe("saturation")
        expect(e.toString()).toBe("93")
        expect(e.isWarning()).toBe(true)
    });
});
describe('When monitoring processed recorded values which are changes from normal to warning range', () => {
    const monitoring: Monitoring = new Monitoring()

    beforeAll(() => {
        [
            record(timestamp(), "saturation", "96"),            // store (normal)
            record(timestamp(5), "saturation", "91"),           // store (warning)
            record(timestamp(10), "saturation", "92"),          //       (warning)  
            record(timestamp(15), "saturation", "93"),          // store (warning) 
            record(timestamp(18), "saturation", "94"),          // store (warning) 
            record(timestamp(19), "saturation", "97"),          // store (normal) 
            record(timestamp(29), "saturation", "98"),          //       (normal) 
            record(timestamp(19 + 60), "saturation", "99"),     // store (normal) 
        ]
            .forEach(record => monitoring.processData(record))
    })

    test('should be 6 stored values', () => {
        expect(monitoring.uncommittedChanges().length).toBe(6)
    });
    // test('should be saturation record with 96 value', () => {
    //     const e = event(monitoring, 0);
    //     expect(e.type()).toBe("saturation")
    //     expect(e.toString()).toBe("96")
    //     expect(e.isNormal()).toBe(true)
    // });
    // test('should be saturation record with 97 value', () => {
    //     const e = event(monitoring, 1);
    //     expect(e.type()).toBe("saturation")
    //     expect(e.toString()).toBe("98")
    //     expect(e.isNormal()).toBe(true)
    // });
});