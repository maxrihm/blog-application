export const SIGNALR_CONNECT = 'SIGNALR_CONNECT';
export const SIGNALR_CONNECTED = 'SIGNALR_CONNECTED';
export const SIGNALR_DISCONNECTED = 'SIGNALR_DISCONNECTED';
export const SIGNALR_RECEIVE_MESSAGE = 'SIGNALR_RECEIVE_MESSAGE';

export const connectSignalR = () => ({ type: SIGNALR_CONNECT });
export const connectedSignalR = () => ({ type: SIGNALR_CONNECTED });
export const disconnectedSignalR = () => ({ type: SIGNALR_DISCONNECTED });
export const receiveMessage = (message) => ({
    type: SIGNALR_RECEIVE_MESSAGE,
    payload: message
});
