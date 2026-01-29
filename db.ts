
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { WordItem, TestHistory } from './types';

// Using default import for Dexie to ensure inheritance types are correctly resolved in this environment.
export class LeksikaDatabase extends Dexie {
  words!: Table<WordItem>;
  history!: Table<TestHistory>;

  constructor() {
    super('LeksikaVocDB');
    // Define database schema
    // Fix: Explicitly casting 'this' to any because the 'version' property is not correctly recognized on the inherited Dexie class in this environment.
    (this as any).version(3).stores({
      words: '++id, en, uz, unit, category, mistakeCount',
      history: '++id, date, unitNames, correct, total, totalTime, avgTime'
    });
  }
}

export const db = new LeksikaDatabase();

export const requestPersistence = async () => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    return isPersisted;
  }
  return false;
};

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(`leksika_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error', e);
  }
};

export const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(`leksika_${key}`);
  return item ? JSON.parse(item) : null;
}
