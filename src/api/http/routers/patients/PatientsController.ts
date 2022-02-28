import Gender from "@adminstration/Gender";
import Name from "@adminstration/Name";
import CommandChain from "@app/CommandChain";
import AddPatient from "@app/commands/AdministrationCommands";
import NormalNumberField from "@common/fields/NormalNumberField";
import { GuidFactory } from "@common/Guid";
import { Request, Response } from "express-serve-static-core";
import PatientQueryService from "../../../../adminstration/patient/PatientQueryService";

export default class PatientsController {

    constructor(
        private readonly _commandChain: CommandChain,
        private readonly _patientsQueryServer: PatientQueryService
    ) { }

    async patients(req: Request, res: Response) {
        res.json(await this._patientsQueryServer.patients())
    }
    async addPatient(req: Request, res: Response) {
        const { firstName, lastName, gender, birthYear } = req.body
        const id = GuidFactory.guid()
        await this._commandChain.process(new AddPatient(
            id,
            Name.create(firstName, lastName),
            Gender.create(gender),
            NormalNumberField.create(birthYear)
        ))
        res.header("Location", `/medical-cards/${id.toString()}`)
        res.sendStatus(201)
    }
}