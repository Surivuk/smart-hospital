export class NameError extends Error {
    constructor(message: string) {
        super(`[Name] Error - ${message}`);
    }
}

export default class Name {

    private constructor(public readonly firstName: string, public readonly lastName: string) { }

    static create(firstName: string, lastName: string): Name {
        const isEmptyOrUndefined = (value: string) => value === null || value === undefined || value.length === 0
        if (isEmptyOrUndefined(firstName)) throw new NameError("Provided firstName is undefined or empty")
        if (isEmptyOrUndefined(lastName)) throw new NameError("Provided lastName is undefined or empty")
        return new Name(firstName, lastName)
    }

    equals(name: Name): boolean {
        return this.firstName === name.firstName &&
            this.lastName === name.lastName;
    }
    fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }

}