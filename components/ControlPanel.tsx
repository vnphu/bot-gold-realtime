
import React from 'react';

interface ControlPanelProps {
  isRunning: boolean;
  onStartStop: () => void;
  lastUpdateTime: Date | null;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isRunning, onStartStop, lastUpdateTime }) => {
  return (
    <div className="flex flex-col items-center space-y-4">
        <button
            onClick={onStartStop}
            className={`w-full px-6 py-3 text-lg font-bold text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
            isRunning 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
        >
            {isRunning ? 'Stop Service' : 'Start Service'}
        </button>
        <div className="flex items-center text-sm">
            <span className="mr-2">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                isRunning ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
                {isRunning ? 'Running' : 'Stopped'}
            </span>
        </div>
        {lastUpdateTime && (
            <p className="text-xs text-gray-400">
                Last update: {lastUpdateTime.toLocaleString()}
            </p>
        )}
    </div>
  );
};

export default ControlPanel;
