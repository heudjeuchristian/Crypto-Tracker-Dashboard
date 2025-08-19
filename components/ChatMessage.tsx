import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex my-2 ${isModel ? 'justify-start' : 'justify-end'}`}>
      <div 
        className={`max-w-xl lg:max-w-2xl px-4 py-2 rounded-lg ${
          isModel ? 'bg-gray-700 text-gray-100' : 'bg-cyan-600 text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;