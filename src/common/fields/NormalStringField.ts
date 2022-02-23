import StringField from "./StringField";

export class NormalStringFieldError extends Error {
    constructor(message: string) {
        super(`[NormalStringField] Error - ${message}`);
    }
}

export default class NormalStringField implements StringField {

    private constructor(private readonly _value: string) { }

    public static create(value: string, tag?: string): NormalStringField {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null)
            throw new NormalStringFieldError(`Provided value is undefined or null. ${printTag}`);
        return new NormalStringField(value);
    }

    toString(): string {
        return this._value;
    }
    equals(field: StringField): boolean {
        return this._value === field.toString()
    }
}