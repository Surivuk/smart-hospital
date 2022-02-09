import Guid from "@helper/Guid";
import Therapy from "./Therapy";

export default interface TherapyRepository {
    therapy(therapyId: Guid): Promise<Therapy>;
    save(therapy: Therapy): Promise<void>;
}