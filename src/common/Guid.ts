import { randomBytes } from "crypto";

export class GuidError extends Error {
    constructor(message: string) {
        super(`[Guid] Error - ${message}`);
    }
}

export default class Guid {
    constructor(private readonly _value: string) { }

    static create(value: string, tag?: string): Guid {
        const printTag = () => tag ? ` Tag: "${tag}"` : "";
        if (value === undefined || value === null || value.length === 0)
            throw new GuidError(`Provided value is undefined or empty. ${printTag()}`);
        return new Guid(value)
    }

    equals(obj: Guid): boolean {
        return this._value === obj._value;
    }
    toString() {
        return this._value;
    }
}

export class GuidFactory {
    static guid(): Guid {
        return new Guid(randomBytes(16).toString('hex'))
    }
}