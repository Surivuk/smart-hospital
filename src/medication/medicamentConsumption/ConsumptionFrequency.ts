export class NotAllowedConsumptionFrequency extends Error { }

export default class ConsumptionFrequency {

    private static readonly ALLOWED_FREQUENCIES: string[] = [
        "daily",
        "every other day",
        "twice a day",
        "three times a day",
        "four times a day",
        "every bedtime",
        "every 4 hours",
        "every 4 to 6 hours",
        "every week",
    ]

    private constructor(private readonly _frequency: string) { }

    static create(frequency: string): ConsumptionFrequency {
        if (this.ALLOWED_FREQUENCIES.find(allowed => frequency === allowed) === undefined)
            throw new NotAllowedConsumptionFrequency(`Provided frequency - "${frequency}"`)
        return new ConsumptionFrequency(frequency);
    }

    toString(): string {
        return this._frequency;
    }
}