// src/services/RabbitMQService.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;

export const connectStomp = (roomId, onMessageReceived) => {
    const socket = new SockJS('http://54.180.244.93:8080/ws'); // 스프링 서버의 WebSocket 엔드포인트
    stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
            console.log('Connected to RabbitMQ STOMP');
            stompClient.subscribe(`/exchange/chat.exchange/room.${roomId}`, (message) => {
                const messageContent = JSON.parse(message.body);
                console.log('Received message:', messageContent);
                onMessageReceived(messageContent);
            });
        },
        onStompError: (frame) => {
            console.error('STOMP error:', frame);
        },
    });
    stompClient.activate();
};

export const disconnectStomp = () => {
    if (stompClient !== null) {
        stompClient.deactivate();
        console.log('Disconnected from STOMP');
    }
};

export const sendMessage = (roomId, message) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/exchange/chat.exchange/room.${roomId}`,
            body: JSON.stringify(message),
        });
    }
};
