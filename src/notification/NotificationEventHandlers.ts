import AlarmQueryService from '@alarming/alarm/AlarmQueryService';
import EventBus from '@app/EventBus';
import AppSocket from '@common/webSocket/AppSocket';
import { AlarmTriggered } from '@events/AlarmingEvents';
import { HealthDataReceived } from '@events/MonitoringEvents';
import HospitalTreatmentQueryService from '@medication/hospitalTreatment/HospitalTreatmentQueryService';

export default class NotificationEventHandlers {

    constructor(
        private _socket: AppSocket,
        private readonly _query: AlarmQueryService,
        private readonly _treatmentQuery: HospitalTreatmentQueryService,
    ) { }

    registerHandlers(eventBus: EventBus) {
        eventBus
            .on<AlarmTriggered>(AlarmTriggered.name, async ({ treatmentId, alarmId, healthData }) => {
                const treatment = await this._treatmentQuery.treatment(treatmentId)
                const { name, trigger, hospitalTreatment } = await this._query.alarm(alarmId)
                this._socket.sendMessage(`alarms`, {
                    message: `${name} - [${trigger.key}] (${healthData.value} ${trigger.operator} ${trigger.value})`,
                    link: `/app/medical-card/${treatment.medicalCard}/hospital-treatments/${hospitalTreatment}`
                })
            })
            .on<HealthDataReceived>(HealthDataReceived.name, async ({ treatmentId, healthData }) => {
                this._socket.sendMessage(`hospital-treatment/${treatmentId.toString()}/data`, healthData)
            })
    }
}