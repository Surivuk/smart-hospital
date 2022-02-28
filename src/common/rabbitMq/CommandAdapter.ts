import { ChainCommand } from "@app/CommandChain";
import AddExample from "@app/commands/Commands";
import { HealthDataReceived } from "@events/MonitoringEvents";
import NotEmptyStringField from "@common/fields/NotEmptyStringField";
import Guid from "@common/Guid";
import AddPatient from "@app/commands/AdministrationCommands";
import Name from "@adminstration/Name";
import Gender from "@adminstration/Gender";
import NormalNumberField from "@common/fields/NormalNumberField";
import { CreateExamination, OpenHospitalTreatment, PrescribeTherapy } from "@app/commands/MedicationCommands";
import MedicamentConsumption from "@medication/medicamentConsumption/MedicamentConsumption";
import ConsumptionRoute from "@medication/medicamentConsumption/ConsumptionRoute";
import ConsumptionFrequency from "@medication/medicamentConsumption/ConsumptionFrequency";

interface CommandSerializer<T extends ChainCommand> {
    (event: T): any
}
interface CommandDeserializer<T extends ChainCommand> {
    (data: any): T
}

export class CommandAdapterError extends Error {
    constructor(message: string) {
        super(`[CommandAdapter] Error - ${message}`);
    }
}

export default class CommandAdapter {

    private readonly _serializer: { [key: string]: CommandSerializer<any> } = {
        [AddPatient.name]: ({ patientId, name, gender, birthYear }: AddPatient) => ({
            patientId: patientId.toString(),
            firstName: name.firstName,
            lastName: name.lastName,
            gender: gender.toString(),
            birthYear: birthYear.value()
        }),
        [CreateExamination.name]: ({ medicalCardId, examinationId, doctorId, diagnose }: CreateExamination) => ({
            medicalCardId: medicalCardId.toString(),
            examinationId: examinationId.toString(),
            doctorId: doctorId.toString(),
            diagnose: diagnose.toString()
        }),
        [PrescribeTherapy.name]: ({ medicalCardId, therapyId, medicaments }: PrescribeTherapy) => ({
            medicalCardId: medicalCardId.toString(),
            therapyId: therapyId.toString(),
            medicaments: medicaments.map(({ medicamentId, strength, amount, route, frequency }) => ({
                medicamentId: medicamentId.toString(),
                strength: strength.valueOf(),
                amount: amount.valueOf(),
                route: route.toString(),
                frequency: frequency.toString()
            }))
        }),
        [OpenHospitalTreatment.name]: ({ medicalCardId, treatmentId }: OpenHospitalTreatment) => ({
            medicalCardId: medicalCardId.toString(),
            treatmentId: treatmentId.toString()
        }),
    }
    private readonly _deserializer: { [key: string]: CommandDeserializer<any> } = {
        [AddPatient.name]: ({ patientId, firstName, lastName, gender, birthYear }) =>
            new AddPatient(new Guid(patientId), Name.create(firstName, lastName), Gender.create(gender), NormalNumberField.create(birthYear)),
        [CreateExamination.name]: ({ medicalCardId, examinationId, doctorId, diagnose }) =>
            new CreateExamination(new Guid(medicalCardId), new Guid(examinationId), new Guid(doctorId), NotEmptyStringField.create(diagnose)),
        [PrescribeTherapy.name]: ({ medicalCardId, therapyId, medicaments }) =>
            new PrescribeTherapy(new Guid(medicalCardId), new Guid(therapyId), medicaments.map(({ medicamentId, strength, amount, route, frequency }: any) =>
                new MedicamentConsumption(new Guid(medicamentId), strength, amount, ConsumptionRoute.create(route), ConsumptionFrequency.create(frequency)))
            ),
        [OpenHospitalTreatment.name]: ({ medicalCardId, treatmentId }) =>
            new OpenHospitalTreatment(new Guid(medicalCardId), new Guid(treatmentId)),
    }


    serialize(command: ChainCommand) {
        const serializer = this._serializer[command.constructor.name]
        if (serializer === undefined)
            throw new CommandAdapterError(`Not found serializer for provided command. Command name: "${command.constructor.name}"`)
        return serializer(command);
    }
    deserialize(commandName: string, data: any) {
        const deserializer = this._deserializer[commandName]
        if (deserializer === undefined)
            throw new CommandAdapterError(`Not found deserializer for provided data. Command name: "${commandName}"`)
        return deserializer(data);
    }
}