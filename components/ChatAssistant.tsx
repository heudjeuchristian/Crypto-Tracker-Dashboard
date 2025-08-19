import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import type { Coin, ChatMessage as ChatMessageType } from '../types';
import ChatMessage from './ChatMessage';
import LoadingSpinner from './LoadingSpinner';

// This is created outside the component to avoid re-instantiating on every render.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCoin: Coin | null;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose, selectedCoin }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
        const systemInstruction = `You are a helpful and informative cryptocurrency expert. 
        Your goal is to provide clear, concise, and unbiased information. 
        Avoid financial advice. 
        The user is currently looking at ${selectedCoin ? selectedCoin.name : 'the dashboard'}. 
        Keep your answers brief and to the point.`;
        
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(newChat);
        
        const initialMessage = selectedCoin
            ? `Hello! I see you're looking at ${selectedCoin.name}. Ask me anything about it or other cryptocurrencies.`
            : 'Hello! How can I help you with your crypto questions today?';

        setMessages([{ role: 'model', text: initialMessage }]);
    } else {
        // Reset state when closed
        setMessages([]);
        setChat(null);
    }
  }, [isOpen, selectedCoin]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !chat || isLoading) return;

    const userMessage: ChatMessageType = { role: 'user', text: currentInput };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentInput;
    setCurrentInput('');
    setIsLoading(true);

    try {
        const result = await chat.sendMessageStream({ message: messageToSend });
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of result) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].text = modelResponse;
                return newMessages;
            });
        }
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-40 flex justify-center items-end sm:items-center"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-gray-800 rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-2xl h-[90%] sm:h-[80%] flex flex-col border border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-cyan-400">AI Crypto Assistant</h2>
          <button onClick={onClose} className="p-1 rounded-full text-2xl leading-none hover:bg-gray-700" aria-label="Close chat">&times;</button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
             <div className="flex my-2 justify-start">
                <div className="max-w-xl lg:max-w-2xl px-4 py-3 rounded-lg bg-gray-700 text-gray-100">
                    <LoadingSpinner />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Ask about crypto..."
              className="flex-1 p-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-70"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button 
                type="submit" 
                className="bg-cyan-600 px-4 py-2 rounded-md font-semibold hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                disabled={isLoading || !currentInput.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;