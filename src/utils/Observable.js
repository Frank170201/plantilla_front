export class Listener {
    _handler = null;

    constructor (handler) {
        if (!handler) return;
        
        this._handler = handler;
    }

    setHandler(handler) {
        this._handler = handler;

        return this;
    }

    _listen(eventName, payload) {
        this._handler?.(eventName, payload);
    }
}

export class Observable {
    static _listeners = {};

    static _instance = new Observable();

    static getInstance() {
        if (!Observable._instance) {
            Observable._instance = new Observable();
        }

        return Observable._instance;
    }

    subscribe(eventName, listener) {
        const randomId = Math.round(Math.random() * 100) + Math.round(Math.random() * 100);

        let eventListeners = Observable._listeners[eventName];

        if (!eventListeners) {
            Observable._listeners[eventName] = new Map();
            eventListeners = Observable._listeners[eventName];
        }
        
        eventListeners.set(randomId, listener);


        return () => {
            eventListeners.delete(randomId);
        }
    }

    static emit(eventName, payload) {
        const subscribers = Observable._listeners[eventName];

        if (!subscribers) return;

        subscribers.forEach(subscriber => {
            subscriber._listen(eventName, payload);
        });
    }
}
