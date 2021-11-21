import Guid from "@helper/Guid";
import ConsumptionFrequency from "./ConsumptionFrequency";
import ConsumptionRoute from "./ConsumptionRoute";

export default class MedicationConsumption {
    constructor(
        public readonly medicationId: Guid,
        public readonly strength: number,
        public readonly amount: number,
        public readonly route: ConsumptionRoute,
        public readonly frequency: ConsumptionFrequency
    ) { }
}