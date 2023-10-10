import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const NotificationManager = () => {
    const [notification, setNotification] = useState('');

    useEffect(() => {
        // Setup SignalR connection
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7056/notificationHub")  // Replace with your Notification Service URL
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.start()
            .catch(err => console.error(err.toString()));

        // Listen for messages
        connection.on("ReceiveMessage", (user, message) => {
            console.log(message);
            setNotification(message);
        });

        // Listen for connection close event
        connection.onclose(async () => {
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before trying to reconnect
            await connection.start();
        });

        // Cleanup on component unmount
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div className="notification">
            {notification && <p>{notification}</p>}
        </div>
    );
};

export default NotificationManager;
