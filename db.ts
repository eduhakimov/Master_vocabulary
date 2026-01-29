
import Dexie from 'dexie';
import type { Table } from 'dexie';
import { WordItem, TestHistory } from './types';

// Use the default export for Dexie to ensure LeksikaDatabase correctly inherits all methods like version(), open(), and isOpen()
export class LeksikaDatabase extends Dexie {
  words!: Table<WordItem>;
  history!: Table<TestHistory>;

  constructor() {
    super('MasterVocDB');
    // version() is a core method of the Dexie class
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
    localStorage.setItem(`mastervoc_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('LocalStorage error', e);
  }
};

export const getFromLocalStorage = (key: string) => {
  const item = localStorage.getItem(`mastervoc_${key}`);
  return item ? JSON.parse(item) : null;
}
