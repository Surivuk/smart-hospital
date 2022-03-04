import { aggregateRootTestFixture, TestFixtureResult } from "@common/AggregateRootTestFixture";
import Guid from "@common/Guid";
import HospitalTreatment, { HospitalTreatmentError } from "@medication/hospitalTreatment/HospitalTreatment";
import { HospitalTreatmentCreated, TherapyAddedToHospitalTreatment, TherapyRemovedFromHospitalTreatment } from "@medication/hospitalTreatment/HospitalTreatmentEvents";

const MEDICATION_CARD_ID = new Guid("aaa-ff-5-98-12358")
const DOCTOR_ID = new Guid("dock-111258")
const HOSPITAL_TREATMENT_ID = new Guid("12314-456465-54564")

function loadedTreatment() {
    const treatment = new HospitalTreatment();
    treatment.loadsFromHistory([new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)])
    return treatment
}

describe('When hospital treatment created', () => {
    let treatment: HospitalTreatment;

    beforeAll(() => {
        treatment = HospitalTreatment.create(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)
    });

    test('should have only one uncommitted event', () => {
        expect(treatment.uncommittedChanges().length).toBe(1)
    });
    test('should have HospitalTreatmentCreated event', () => {
        expect(treatment.uncommittedChanges()[0]).toBeInstanceOf(HospitalTreatmentCreated);
    });
    test('should have same ID as provided ID in constructor', () => {
        expect(treatment.id.equals(HOSPITAL_TREATMENT_ID)).toBe(true)
    });
});

describe('When the treatment added new therapy', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)],
            when: (root) => {
                root.addTherapy(new Guid("therapy-123"))
            }
        })
    });
    test('should have TherapyAddedToHospitalTreatment event', () => {
        expect(result.events[0]).toBeInstanceOf(TherapyAddedToHospitalTreatment)
    });
});
describe('When the treatment added therapy that already added', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)],
            when: (root) => {
                root.addTherapy(new Guid("therapy-123"))
                root.addTherapy(new Guid("therapy-123"))
            }
        })
    })
    test('should throw an error', () => {
        expect(result.error).toBeDefined()
    });
    test('should throw HospitalTreatmentError', () => {
        expect(result.error).toBeInstanceOf(HospitalTreatmentError)
    });
});
describe('When the therapy removed from treatment', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)],
            when: (root) => {
                root.removeTherapy(new Guid("therapy-123"))
            }
        })
    })
    test('should throw an error', () => {
        expect(result.error).toBeDefined()
    });
});
describe('When the therapy removed from treatment that do no have any therapy', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID)],
            when: (root) => {
                root.removeTherapy(new Guid("therapy-123"))
            }
        })
    })
    test('should throw an error', () => {
        expect(result.error).toBeDefined()
    });
});
describe('When the therapy removed from treatment', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [
                new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID),
                new TherapyAddedToHospitalTreatment(HOSPITAL_TREATMENT_ID, new Guid("therapy-123"))
            ],
            when: (root) => {
                root.removeTherapy(new Guid("therapy-123"))
            }
        })
    })
    test('should therapy be removed', () => {
        expect((result.events[0] as TherapyRemovedFromHospitalTreatment).therapyId).toMatchObject(new Guid("therapy-123"))
    });
});
describe('When the therapy added after removing it from treatment', () => {
    let result: TestFixtureResult;

    beforeAll(() => {
        result = aggregateRootTestFixture({
            root: () => new HospitalTreatment(),
            given: () => [
                new HospitalTreatmentCreated(HOSPITAL_TREATMENT_ID, MEDICATION_CARD_ID),
                new TherapyAddedToHospitalTreatment(HOSPITAL_TREATMENT_ID, new Guid("therapy-123"))
            ],
            when: (root) => {
                root.removeTherapy(new Guid("therapy-123"))
                root.addTherapy(new Guid("therapy-123"))
            }
        })
    })
    test('should not throw and error', () => {
        expect(result.error).toBeUndefined()
    });
    test('should publish two events', () => {
        expect(result.events[0]).toBeInstanceOf(TherapyRemovedFromHospitalTreatment)
        expect(result.events[1]).toBeInstanceOf(TherapyAddedToHospitalTreatment)
    });
});