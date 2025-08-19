import React from 'react';

interface SentimentIndicatorProps {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
}

const sentimentStyles = {
  Bullish: {
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12 7a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0zm4 4a1 1 0 100 2h-1.586l.293.293a1 1 0 01-1.414 1.414l-2-2a1 1 0 010-1.414l2-2a1 1 0 011.414 1.414L10.414 11H12z" clipRule="evenodd" />
        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />
      </svg>
    ),
  },
  Bearish: {
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
  Neutral: {
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
      </svg>
    ),
  },
};


const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ sentiment }) => {
  const styles = sentimentStyles[sentiment] || sentimentStyles.Neutral;
  return (
    <div className={`inline-flex items-center py-1 px-3 rounded-full text-sm font-semibold ${styles.bgColor} ${styles.textColor}`}>
      {styles.icon}
      <span>{sentiment}</span>
    </div>
  );
};

export default SentimentIndicator;
