import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGoldPrices } from './services/goldService';
import { sendTelegramMessage } from './services/telegramService';
import { storageService } from './services/storageService';
import type { GoldPrice, Log } from './types';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import ControlPanel from './components/ControlPanel';
import DataTable from './components/DataTable';
import LogViewer from './components/LogViewer';
import WarningBanner from './components/WarningBanner';

const App: React.FC = () => {
  // Load saved config on initialization
  const savedConfig = storageService.loadConfig();
  
  const [botToken, setBotToken] = useState<string>(savedConfig?.botToken || '');
  const [chatId, setChatId] = useState<string>(savedConfig?.chatId || '');
  const [intervalValue, setIntervalValue] = useState<string>(savedConfig?.intervalValue || '1');
  const [intervalUnit, setIntervalUnit] = useState<'minutes' | 'hours'>(savedConfig?.intervalUnit || 'hours');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [goldData, setGoldData] = useState<GoldPrice[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const intervalRef = useRef<number | null>(null);

  // Auto-save configuration whenever it changes
  useEffect(() => {
    if (botToken || chatId) { // Only save if at least one field has a value
      storageService.saveConfig({
        botToken,
        chatId,
        intervalValue,
        intervalUnit
      });
    }
  }, [botToken, chatId, intervalValue, intervalUnit]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const newLog: Log = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 100)); // Keep last 100 logs
  }, []);

  const runUpdate = useCallback(async () => {
    if (!botToken || !chatId) {
      addLog("Bot Token and Chat ID must be set.", 'error');
      setIsRunning(false);
      return;
    }

    addLog("Fetching latest gold prices...");
    try {
      const data = await fetchGoldPrices();
      setGoldData(data);
      setLastUpdateTime(new Date());
      addLog("Successfully fetched gold prices.", "success");

      const message = formatMessage(data);
      addLog("Sending update to Telegram...");
      await sendTelegramMessage(botToken, chatId, message);
      addLog("Telegram update sent successfully.", "success");

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      addLog(`Error: ${errorMessage}`, 'error');
      setIsRunning(false); // Stop on error
    }
  }, [botToken, chatId, addLog]);

  useEffect(() => {
    if (isRunning) {
      const numericInterval = parseInt(intervalValue, 10);

      if (isNaN(numericInterval) || numericInterval <= 0) {
        addLog("Invalid interval. Please enter a positive number.", 'error');
        setIsRunning(false);
        return;
      }

      const intervalMs = intervalUnit === 'hours' 
        ? numericInterval * 3600 * 1000 
        : numericInterval * 60 * 1000;

      runUpdate(); // Run immediately on start
      intervalRef.current = window.setInterval(runUpdate, intervalMs);
      
      const unitString = numericInterval === 1 
        ? intervalUnit.slice(0, -1) 
        : intervalUnit;
      addLog(`Service started. Updates will be sent every ${numericInterval} ${unitString}.`, 'info');

    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        addLog("Service stopped.", 'info');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, runUpdate, addLog, intervalValue, intervalUnit]);

  const handleStartStop = () => {
    setIsRunning(prev => !prev);
  };
  
  const formatMessage = (data: GoldPrice[]): string => {
    let message = `*Gold Price Update - ${new Date().toLocaleString()}*\n\n`;
    message += "```\n";
    message += "Type         | Buy        | Sell\n";
    message += "--------------------------------------\n";
    data.forEach(item => {
        const type = item.type.padEnd(12);
        const buy = item.buy.padEnd(10);
        const sell = item.sell.padEnd(10);
        message += `${type} | ${buy} | ${sell}\n`;
    });
    message += "```\n";
    message += "_Data sourced from 24h.com.vn (simulated)_";
    return message;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <WarningBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-1 space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">1. Configuration</h2>
                <ConfigForm 
                    botToken={botToken}
                    setBotToken={setBotToken}
                    chatId={chatId}
                    setChatId={setChatId}
                    intervalValue={intervalValue}
                    setIntervalValue={setIntervalValue}
                    intervalUnit={intervalUnit}
                    setIntervalUnit={setIntervalUnit}
                    disabled={isRunning}
                />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">2. Control Panel</h2>
                <ControlPanel 
                    isRunning={isRunning}
                    onStartStop={handleStartStop}
                    lastUpdateTime={lastUpdateTime}
                />
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                 <h2 className="text-xl font-bold mb-4 text-cyan-400">3. Live Gold Prices</h2>
                <DataTable goldData={goldData} />
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-cyan-400">4. Activity Logs</h2>
                <LogViewer logs={logs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;