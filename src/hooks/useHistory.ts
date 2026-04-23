import { useState, useEffect } from 'react';

export type Role = 'driver' | 'conveyor' | 'worker';

export interface HistoryRecord {
  id: string;
  date: string;
  role: Role;
  name: string;
  location: string;
  taskType: string;
  note: string;
  timestamp: number;
}

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sme_historique');
    if (saved) {
      try { setRecords(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveRecords = (newRecords: HistoryRecord[]) => {
    const updated = [...newRecords, ...records];
    setRecords(updated);
    localStorage.setItem('sme_historique', JSON.stringify(updated));
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('sme_historique', JSON.stringify(updated));
  };

  const clearAll = () => {
    setRecords([]);
    localStorage.setItem('sme_historique', JSON.stringify([]));
  };

  const replaceRecordsForDate = (date: string, newRecords: HistoryRecord[]) => {
    const filtered = records.filter(r => r.date !== date);
    const updated = [...newRecords, ...filtered];
    setRecords(updated);
    localStorage.setItem('sme_historique', JSON.stringify(updated));
  };

  return { records, saveRecords, deleteRecord, clearAll, replaceRecordsForDate };
}
