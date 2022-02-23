import { randomBytes } from "crypto";

export default class Guid {
    constructor(private readonly value: string) { }

    equals(obj: Guid): boolean {
        return this.value === obj.value;
    }
    toString() {
        return this.value;
    }
}

export class GuidFactory {
    static guid(): Guid {
        return new Guid(randomBytes(16).toString('hex'))
    }
}