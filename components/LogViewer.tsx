
import React from 'react';
import type { Log } from '../types';

interface LogViewerProps {
  logs: Log[];
}

const getLogColor = (type: Log['type']) => {
  switch (type) {
    case 'success':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'info':
    default:
      return 'text-gray-400';
  }
};

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  return (
    <div className="h-64 bg-gray-900 rounded-lg p-4 overflow-y-auto font-mono text-xs border border-gray-700">
      {logs.length === 0 ? (
        <p className="text-gray-500">Logs will appear here...</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="flex">
            <span className="text-gray-500 mr-2">{log.timestamp}</span>
            <span className={`${getLogColor(log.type)} flex-1`}>{log.message}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default LogViewer;
