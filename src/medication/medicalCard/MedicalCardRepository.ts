import Guid from "@common/Guid";
import MedicalCard from "./MedicalCard"

export default interface MedicalCardRepository {
    medicalCard(id: Guid): Promise<MedicalCard>
    save(medicalCard: MedicalCard): Promise<void>;
}