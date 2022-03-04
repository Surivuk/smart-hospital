import SystolicBloodPressure from "@healthCenter/healthData/SystolicBloodPressure";

function pressure(value: number) {
    return new SystolicBloodPressure(new Date().getTime(), value)
}

describe('SystolicBloodPressure', () => {
    test('normal values', () => {
        expect(pressure(120).isNormal()).toBe(true)
        expect(pressure(140).isNormal()).toBe(true)
    });
    test('warning values', () => {
        expect(pressure(141).isWarning()).toBe(true)
        expect(pressure(160).isWarning()).toBe(true)
    });
    test('critical values', () => {
        expect(pressure(161).isCritical()).toBe(true)
        expect(pressure(180).isCritical()).toBe(true)
    });
});