
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500">
        Gold Price Telegram Notifier
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        This tool simulates fetching gold prices and sending hourly updates to your Telegram channel.
      </p>
    </header>
  );
};

export default Header;
