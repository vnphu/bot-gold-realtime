
import React from 'react';

const WarningIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
);


const WarningBanner: React.FC = () => {
  return (
    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg relative mt-8 text-sm" role="alert">
      <div className="flex items-center">
        <WarningIcon />
        <div>
          <strong className="font-bold">Important Notice:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><span className="font-semibold">Security Risk:</span> Never enter your real Telegram Bot Token on a public website. This tool is for demonstration only. Your token is processed in your browser and is not saved anywhere.</li>
            <li><span className="font-semibold">Browser-Based:</span> This is not a real server. This browser tab must remain open for the notifier to work.</li>
            <li><span className="font-semibold">Simulated Data:</span> Direct website scraping is not possible from a browser due to security (CORS) policies. This app uses mock data.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
