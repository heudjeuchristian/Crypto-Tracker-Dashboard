
import React from 'react';

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h5m11 2v5h-5m-1.42-1.42A8.962 8.962 0 0112 5c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"
    />
  </svg>
);

export default RefreshIcon;
