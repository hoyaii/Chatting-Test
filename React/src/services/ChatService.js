// src/services/ChatService.js
import axios from 'axios';


const accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5ZzA0MDc2NEBuYXZlci5jb20iLCJyb2xlIjowLCJuaWNrTmFtZSI6Iu2YuOyWmOydtDQiLCJpZCI6MywiZXhwIjoxNzIyNTkzMTUzfQ.5NSvRGPsKXc3qjU0yD2rov-D3iD5a3z4Grpyx8klnR1DAe4-hNxy2ga56MgdQYDsR7srnNMxc0XmPPMbghIxMg';
axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export const sendMessage = async (chatRoomId, content, images = []) => {
    const sendDate = new Date().toISOString(); 
    const response = await axios.post(`${API_BASE_URL}/chat/send`, {
        chatRoomId,
        content,
        images,
        sendDate
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
