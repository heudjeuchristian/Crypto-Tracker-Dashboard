import React, { useState, useEffect } from 'react';
import RefreshIcon from './RefreshIcon';
import ChatIcon from './ChatIcon';

interface HeaderProps {
    onRefresh: () => void;
    isRefreshing: boolean;
    lastUpdated: Date | null;
    onToggleChat: () => void;
}

const formatTimeAgo = (date: Date | null): string => {
    if (!date) return 'N/A';
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return date.toLocaleDateString();
};


const Header: React.FC<HeaderProps> = ({ onRefresh, isRefreshing, lastUpdated, onToggleChat }) => {
    const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(lastUpdated));

    useEffect(() => {
        setTimeAgo(formatTimeAgo(lastUpdated)); // Update immediately
        const interval = setInterval(() => {
            setTimeAgo(formatTimeAgo(lastUpdated));
        }, 5000); // Then update every 5 seconds
        return () => clearInterval(interval);
    }, [lastUpdated]);


  return (
    <header className="p-4 sm:p-6 shadow-md bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-tight">
                    Crypto Tracker Dashboard
                </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-gray-400 text-sm hidden sm:block">
                    Last updated: {timeAgo}
                </span>
                <button
                    onClick={onToggleChat}
                    className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Chat with AI"
                >
                    <ChatIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Refresh data"
                >
                    <RefreshIcon className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>
        </div>
    </header>
  );
};

export default Header;