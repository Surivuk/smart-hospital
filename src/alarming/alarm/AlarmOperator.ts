export class AlarmOperatorError extends Error {
    constructor(message: string) {
        super(`[AlarmOperator] Error - ${message}`);
    }
}

export default class AlarmOperator {

    private constructor(private readonly _operator: "AND" | "OR") { }

    static create(operator: string): AlarmOperator {
        if (["AND", "OR"].indexOf(operator.toUpperCase()) === -1)
            throw new AlarmOperatorError(`Provided operator is not supported. Operator: "${operator}"`)
        return new AlarmOperator(operator.toUpperCase() as "AND" | "OR")
    }

    toString(): string {
        return this._operator;
    }
}