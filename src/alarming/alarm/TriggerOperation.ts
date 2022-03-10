export class TriggerOperationError extends Error {
    constructor(message: string) {
        super(`[TriggerOperation] Error - ${message}`);
    }
}

export default class TriggerOperator {
    constructor(private readonly _operator: "=" | "<" | ">") { }

    static create(operation: string): TriggerOperator {
        if (["=", "<", ">"].indexOf(operation) === -1)
            throw new TriggerOperationError(`Provided operator is not supported. Operator: "${operation}"`);
        return new TriggerOperator(operation as "=" | "<" | ">")
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
        if(this._operator === "<") return b < a;
        if(this._operator === ">") return b > a;
        return a === b;
    }

    toString() {
        return this._operator;
    }
}