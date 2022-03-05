export class TriggerOperationError extends Error {
    constructor(message: string) {
        super(`[TriggerOperation] Error - ${message}`);
    }
}

export default class TriggerOperation {
    constructor(private readonly _operation: "=" | "<" | ">") { }

    static create(operation: string): TriggerOperation {
        if (["=", "<", ">"].indexOf(operation) === -1)
            throw new TriggerOperationError(`Provided operation is not supported. Operation: "${operation}"`);
        return new TriggerOperation(operation as "=" | "<" | ">")
    }

    triggered(referentValue: string, arrivedValue: string): boolean {
        if (this.isBoolean(referentValue) && this.isBoolean(arrivedValue)) return this.check(this.boolean(referentValue), this.boolean(arrivedValue))
        if (this.isNumber(referentValue) && this.isNumber(arrivedValue)) return this.check(this.number(referentValue), this.number(arrivedValue))
        return this.check(referentValue, arrivedValue);
    }

    private isBoolean(value: string): boolean {
        return value === "true" || value === "false"
    }
    private isNumber(value: string): boolean {
        return !isNaN(parseInt(value)) || !isNaN(parseFloat(value))
    }
    private boolean(value: string): boolean {
        return value === "true" ? true : false;
    }
    private number(value: string): number {
        if (value.indexOf('.') === -1)
            return parseInt(value)
        return parseFloat(value)
    }
    private check(a: any, b: any): boolean {
        if(this._operation === "<") return b < a;
        if(this._operation === ">") return b > a;
        return a === b;
    }

    toString() {
        return this._operation;
    }
}