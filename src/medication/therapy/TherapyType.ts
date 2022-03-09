export class TherapyTypeError extends Error {
    constructor(message: string) {
        super(`[TherapyType] Error - ${message}`);
    }
}
export default class TherapyType {

    private constructor(private readonly _type: string) { }

    static static(): TherapyType {
        return new TherapyType("static")
    }
    static dynamic(): TherapyType {
        return new TherapyType("dynamic")
    }
    static fromString(value: string): TherapyType {
        if (["dynamic", "static"].indexOf(value) === -1) throw new TherapyTypeError(`Provided string is not supported type. Type: "${value}"`)
        return new TherapyType("static")
    }

    isStatic() {
        return this._type === "static"
    }

    toString() {
        return this._type
    }
}