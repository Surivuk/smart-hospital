import SPO2 from "@healthCenter/healthData/SPO2";

function spo2(value: number) {
    return new SPO2(new Date().getTime(), value)
}

describe('SPO2', () => {
    test('normal values', () => {
        expect(spo2(95).isNormal()).toBe(true)
        expect(spo2(99).isNormal()).toBe(true)
    });
    test('warning values', () => {
        expect(spo2(90).isWarning()).toBe(true)
        expect(spo2(94).isWarning()).toBe(true)
    });
    test('critical values', () => {
        expect(spo2(89).isCritical()).toBe(true)
        expect(spo2(75).isCritical()).toBe(true)
    });
});