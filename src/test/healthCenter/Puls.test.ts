import Pulse from "@healthCenter/healthData/Pulse";

function pulse(value: number) {
    return new Pulse(new Date().getTime(), value)
}

describe('Pulse', () => {
    test('normal values', () => {
        expect(pulse(60).isNormal()).toBe(true)
        expect(pulse(80).isNormal()).toBe(true)
    });
    test('warning values', () => {
        expect(pulse(81).isWarning()).toBe(true)
        expect(pulse(120).isWarning()).toBe(true)

        expect(pulse(59).isWarning()).toBe(true)
        expect(pulse(40).isWarning()).toBe(true)
    });
    test('critical values', () => {
        expect(pulse(121).isCritical()).toBe(true)
        expect(pulse(39).isCritical()).toBe(true)
    });
});