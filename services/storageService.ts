// Service to manage persistent storage of configuration

export interface AppConfig {
  botToken: string;
  chatId: string;
  intervalValue: string;
  intervalUnit: 'minutes' | 'hours';
}

const STORAGE_KEY = 'gold-price-notifier-config';

export const storageService = {
  // Save configuration to localStorage
  saveConfig(config: AppConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      console.log('Config saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration');
    }
  },

  // Load configuration from localStorage
  loadConfig(): AppConfig | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const config = JSON.parse(stored) as AppConfig;
        console.log('Config loaded successfully');
        return config;
      }
      return null;
    } catch (error) {
      console.error('Error loading config:', error);
      return null;
    }
  },

  // Clear configuration from localStorage
  clearConfig(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('Config cleared successfully');
    } catch (error) {
      console.error('Error clearing config:', error);
    }
  },

  // Check if config exists
  hasConfig(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }
};
