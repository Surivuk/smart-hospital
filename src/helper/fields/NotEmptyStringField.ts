import StringField from "./StringField";

export class NotEmptyStringFieldError extends Error {
    constructor(message: string) {
        super(`[NotEmptyStringField] Error - ${message}`);
    }
}

export default class NotEmptyStringField implements StringField {

    private constructor(private readonly _value: string) { }

    public static create(value: string, tag?: string): NotEmptyStringField {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null || value.length === 0)
            throw new NotEmptyStringFieldError(`Provided value is undefined or null or empty. ${printTag}`);
        return new NotEmptyStringField(value);
    }

    toString(): string {
        return this._value;
    }
    equals(field: StringField): boolean {
        return this._value === field.toString()
    }
}