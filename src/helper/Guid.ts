import { randomBytes } from "crypto";

export default class Guid {
    constructor(private readonly value: string) { }

    toString() {
        return this.value;
    }
}

export class GuidFactory {
    static guid(): Guid {
        return new Guid(randomBytes(16).toString('hex'))
    }
}