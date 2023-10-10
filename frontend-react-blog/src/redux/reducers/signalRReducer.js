import {
    SIGNALR_CONNECTED,
    SIGNALR_DISCONNECTED,
    SIGNALR_RECEIVE_MESSAGE
} from '../../actions/signalRActions';

const initialState = {
    connected: false,
    message: null
};

export default function signalRReducer(state = initialState, action) {
    switch (action.type) {
        case SIGNALR_CONNECTED:
            return { ...state, connected: true };
        case SIGNALR_DISCONNECTED:
            return { ...state, connected: false };
        case SIGNALR_RECEIVE_MESSAGE:
            return { ...state, message: action.payload };
        default:
            return state;
    }
}
