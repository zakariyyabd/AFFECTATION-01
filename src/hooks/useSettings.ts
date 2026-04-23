import { useState, useEffect } from 'react';

export type TaskDef = {
  name: string;
  location: string;
};

export type SettingsData = {
  drivers: string[];
  workers: string[];
  conveyors: string[];
  taskTypes: TaskDef[];
};

const defaultSettings: SettingsData = {
  drivers: [],
  workers: [],
  conveyors: [],
  taskTypes: [],
};

export function useSettings() {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sme_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle migration from old string[] taskTypes to TaskDef[]
        if (Array.isArray(parsed.taskTypes) && parsed.taskTypes.length > 0 && typeof parsed.taskTypes[0] === 'string') {
          parsed.taskTypes = parsed.taskTypes.map((name: string) => ({ name, location: '' }));
        }
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Failed to parse settings');
      }
    }
    setIsLoaded(true);
  }, []);

  const updateSetting = <K extends keyof SettingsData>(key: K, items: SettingsData[K]) => {
    const newSettings = { ...settings, [key]: items };
    setSettings(newSettings);
    localStorage.setItem('sme_settings', JSON.stringify(newSettings));
  };

  return { settings, updateSetting, isLoaded };
}
