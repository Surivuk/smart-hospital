import NumberField from "./NumberField";

export class NormalNumberFieldError extends Error {
    constructor(message: string) {
        super(`[NormalNumberField] Error - ${message}`);
    }
}

export default class NormalNumberField implements NumberField {

    private constructor(private readonly _value: number) { }

    public static create(value: number, tag?: string): NormalNumberField {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null)
            throw new NormalNumberFieldError(`Provided value is undefined or null. ${printTag()}`);
        return new NormalNumberField(value);
    }

    value(): number {
        return this._value;
    }
    equals(field: NumberField): boolean {
        return this.value() === field.value()
    }
}