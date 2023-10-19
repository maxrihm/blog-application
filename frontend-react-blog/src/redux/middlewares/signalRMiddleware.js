import * as signalR from '@microsoft/signalr';
import { 
    SIGNALR_CONNECT, 
    connectedSignalR, 
    disconnectedSignalR, 
    receiveMessage 
} from '../../actions/signalRActions';

export const signalRMiddleware = store => next => async action => {
    next(action);

    if (action.type === SIGNALR_CONNECT) {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5006/notificationHub")
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on("ReceiveMessage", (user, message) => {
            store.dispatch(receiveMessage(message));
        });

        connection.onclose(() => {
            store.dispatch(disconnectedSignalR());
        });

        try {
            await connection.start();
            store.dispatch(connectedSignalR());
        } catch (error) {
            console.error("Failed to connect", error);
        }
    }
};
