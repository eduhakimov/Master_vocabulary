
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { WordItem, TestHistory } from './types';

// Use default import for Dexie to ensure the class is correctly recognized for inheritance in all environments.
export class LeksikaDatabase extends Dexie {
  words!: Table<WordItem>;
  history!: Table<TestHistory>;

  constructor() {
    super('LeksikaVocDB');
    // Initialize version and stores using the inherited version method from Dexie.
    this.version(3).stores({
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
