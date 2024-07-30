// src/services/ChatService.js
import axios from 'axios';

const API_BASE_URL = 'http://54.180.244.93:8080/api';

const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5ZzA0MDc2NEBuYXZlci5jb20iLCJyb2xlIjowLCJuaWNrTmFtZSI6Iu2YuOyWmOydtDQiLCJpZCI6MywiZXhwIjoxNzIyMzQ2OTM4fQ._ZTBCBJqbRgV73issF5VMve4fZKy1G7TJJ1CGjLb-_R8e3qsVPPi3nnw2t_X4e0qBvgPcP8DfX6klK3x7D257Q';
axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const sendMessage = async (chatRoomId, content, images = []) => {
    const response = await axios.post(`${API_BASE_URL}/chat/send`, {
        chatRoomId,
        content,
        images
    });
    return response.data;
};

export const getChatRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chatRooms`);
        console.log('getChatRooms response:', response.data.result.rooms); 
        return response.data.result.rooms;
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
    }
};

export const getMessages = async (chatRoomId, page = 0) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chatRooms/${chatRoomId}/messages`, {
            params: { page }
        });
        console.log('getMessages response:', response.data.result.messages);
        return response.data.result.messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};
