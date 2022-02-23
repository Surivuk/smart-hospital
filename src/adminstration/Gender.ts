export class GenderError extends Error {
    constructor(message: string) {
        super(`[Gender] Error - ${message}`);
    }
}

export default class Gender {

    private constructor(private readonly _gender: string) { }

    static create(gender: string): Gender {
        if (["male", "female"].indexOf(gender) === -1)
            throw new GenderError(`Provided gender is not valid. Gender: "${gender}"`)
        return new Gender(gender)
    }

    equals(gender: Gender): boolean {
        return this._gender === gender._gender
    }
    toString() {
        return this._gender
    }
}