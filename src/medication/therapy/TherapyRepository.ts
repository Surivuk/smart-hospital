import Guid from "@common/Guid";
import Therapy from "./Therapy";
import TherapyContract from "./TherapyContract";

export default interface TherapyRepository {
    therapy(therapyId: Guid): Promise<TherapyContract>;
    save(therapy: TherapyContract): Promise<void>;
}