import React, { useEffect, useState } from 'react';
import './styles.css';  // 스타일시트 추가
import { connectStomp, disconnectStomp } from './services/RabbitMQService';
import { getChatRooms, getMessages, sendMessage } from './services/ChatService';

function App() {
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchChatRooms();

    return () => {
        disconnectStomp();
    };
  }, []);

  const fetchChatRooms = async () => {
    try {
      const rooms = await getChatRooms();
      setChatRooms(rooms || []);
    } catch (error) {
      console.error('Failed to fetch chat rooms:', error);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      const messages = await getMessages(roomId);
      setMessages(messages || []);
      setSelectedRoomId(roomId);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleRoomSelection = (roomId) => {
    disconnectStomp();
    fetchMessages(roomId);
    connectStomp(roomId, (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  };

  const handleSendMessage = async () => {
      if (selectedRoomId && newMessage.trim()) {
          try {
              await sendMessage(selectedRoomId, newMessage);
              setNewMessage('');
          } catch (error) {
              console.error('Failed to send message:', error);
          }
      }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <h1>Chat Rooms</h1>
        <ul>
          {chatRooms.map((room) => (
            <li key={room.chatRoomId} className="chat-room" onClick={() => handleRoomSelection(room.chatRoomId)}>
              {room.name}
            </li>
          ))}
        </ul>
      </div>
      {selectedRoomId && (
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.nickName === "호얘이4" ? 'sent' : 'received'}`}>
                <strong>{msg.nickName}</strong>: {msg.content}
              </div>
            ))}
          </div>
          <div className="message-input-container">
            <input
              type="text"
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="send-button" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
