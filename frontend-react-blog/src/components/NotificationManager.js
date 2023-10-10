import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const NotificationManager = () => {
    const message = useSelector(state => state.signalR.message);

    useEffect(() => {
        if (message) {
            toast(message);
        }
    }, [message]);

    return null;  // This component does not render anything
};

export default NotificationManager;
