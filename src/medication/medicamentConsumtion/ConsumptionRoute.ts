export class NotAllowedConsumptionRoute extends Error { }

export default class ConsumptionRoute {

    private static readonly ALLOWED_ROUTES: string[] = [
        "PO (by mouth)",
        "PR (per rectum)",
        "IM (intramuscular)",
        "IV (intravenous)",
        "ID (intradermal)",
        "IN (intranasal)",
        "TP (topical)",
        "SL (sublingual)",
        "BUCC (buccal)",
        "IP (intraperitoneal)",
    ]

    private constructor(private readonly _route: string) { }

    static create(route: string): ConsumptionRoute {
        if (this.ALLOWED_ROUTES.find(allowed => route === allowed) === undefined)
            throw new NotAllowedConsumptionRoute(`Provided route - "${route}"`)
        return new ConsumptionRoute(route);
    }

    toString(): string {
        return this._route;
    }
}