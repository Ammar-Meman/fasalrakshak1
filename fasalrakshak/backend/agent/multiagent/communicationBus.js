import { EventEmitter } from 'events';

class CommunicationBus extends EventEmitter {}
const bus = new CommunicationBus();

export const publishEvent = (event, payload) => {
    bus.emit(event, payload);
};

export const subscribeToEvent = (event, callback) => {
    bus.on(event, callback);
};
