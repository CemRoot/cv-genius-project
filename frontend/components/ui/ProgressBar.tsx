import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  showPercentage?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  status = 'processing',
  showPercentage = true,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-blue-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Starting...';
      case 'processing':
        return 'Generating CV...';
      case 'completed':
        return 'Complete!';
      case 'failed':
        return 'Failed';
      default:
        return '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {getStatusText()}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={`${sizeClasses[size]} ${getStatusColor()} rounded-full transition-all duration-500 ease-out ${
            status === 'processing' ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      
      {status === 'processing' && (
        <div className="mt-2 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-xs text-gray-600">
            This may take a few minutes...
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;