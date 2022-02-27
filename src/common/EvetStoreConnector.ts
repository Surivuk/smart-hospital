import ESMedicalCardRepository from "@medication/medicalCard/persistance/ESMedicalCardRepository";

export default abstract class EventStoreConnector {
    constructor(protected readonly _client: ESMedicalCardRepository) { }
}