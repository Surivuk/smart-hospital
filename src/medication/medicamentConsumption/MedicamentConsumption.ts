import Guid from "@helper/Guid";
import ConsumptionFrequency from "./ConsumptionFrequency";
import ConsumptionRoute from "./ConsumptionRoute";

export default class MedicamentConsumption {
    constructor(
        public readonly medicamentId: Guid,
        public readonly strength: number,
        public readonly amount: number,
        public readonly route: ConsumptionRoute,
        public readonly frequency: ConsumptionFrequency
    ) { }
}