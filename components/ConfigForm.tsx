import React from 'react';

interface ConfigFormProps {
  botToken: string;
  setBotToken: (token: string) => void;
  chatId: string;
  setChatId: (id: string) => void;
  intervalValue: string;
  setIntervalValue: (value: string) => void;
  intervalUnit: 'minutes' | 'hours';
  setIntervalUnit: (unit: 'minutes' | 'hours') => void;
  disabled: boolean;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ 
  botToken, 
  setBotToken, 
  chatId, 
  setChatId, 
  intervalValue,
  setIntervalValue,
  intervalUnit,
  setIntervalUnit,
  disabled 
}) => {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="botToken" className="block text-sm font-medium text-gray-300">Telegram Bot Token</label>
        <input
          type="password"
          id="botToken"
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          disabled={disabled}
          placeholder="Enter your bot token"
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="chatId" className="block text-sm font-medium text-gray-300">Telegram Chat ID</label>
        <input
          type="text"
          id="chatId"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          disabled={disabled}
          placeholder="Enter your chat ID"
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
        />
      </div>
       <div>
        <label htmlFor="interval" className="block text-sm font-medium text-gray-300">Tần suất cập nhật</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="number"
            id="interval"
            value={intervalValue}
            onChange={(e) => setIntervalValue(e.target.value)}
            disabled={disabled}
            min="1"
            placeholder="VD: 15"
            className="flex-1 block w-full min-w-0 bg-gray-700 border border-gray-600 rounded-none rounded-l-md py-2 px-3 text-white focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          />
          <select
            id="intervalUnit"
            value={intervalUnit}
            onChange={(e) => setIntervalUnit(e.target.value as 'minutes' | 'hours')}
            disabled={disabled}
            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-600 bg-gray-700 text-gray-300 text-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50"
          >
            <option value="minutes">Phút</option>
            <option value="hours">Giờ</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default ConfigForm;