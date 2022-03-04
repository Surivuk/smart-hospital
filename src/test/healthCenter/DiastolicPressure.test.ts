import DiastolicBloodPressure from "@healthCenter/healthData/DiastolicBloodPressure";

function pressure(value: number) {
    return new DiastolicBloodPressure(new Date().getTime(), value)
}

describe('DiastolicBloodPressure', () => {
    test('normal values', () => {
        expect(pressure(90).isNormal()).toBe(true)
    });
    test('warning values', () => {
        expect(pressure(91).isWarning()).toBe(true)
        expect(pressure(100).isWarning()).toBe(true)
    });
    test('critical values', () => {
        expect(pressure(111).isCritical()).toBe(true)
        expect(pressure(120).isCritical()).toBe(true)
    });
});