/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type HistoryEntryType = 'retouch' | 'filter' | 'adjustment';

export interface HistoryEntry {
  id: string;
  timestamp: number;
  type: HistoryEntryType;
  prompt: string;
  status: 'success' | 'error';
  error?: string;
  imageUrl?: string;
}

const HISTORY_KEY = 'beo-image-pro-history';

export const getHistory = (): HistoryEntry[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    if (historyJson) {
      return JSON.parse(historyJson);
    }
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
  }
  return [];
};

export const addHistoryEntry = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
  try {
    const history = getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    const newHistory = [newEntry, ...history];
    // Keep history to a reasonable size to avoid filling up localStorage
    if (newHistory.length > 50) {
        newHistory.length = 50;
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save history to localStorage", error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage", error);
  }
};