import Examination from "./Examination";

export default interface ExaminationRepository {
    save(examination: Examination): Promise<void>;
}