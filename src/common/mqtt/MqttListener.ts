import MqttReceiver from "./MqttReceiver";

export default interface MqttListener {
    receiver(): MqttReceiver 
}