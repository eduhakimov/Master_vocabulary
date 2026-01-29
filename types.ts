
export interface WordItem {
  id?: number;
  en: string;
  uz: string;
  unit: string;
  category: string;
  mistakeCount: number;
}

export interface TestHistory {
  id?: number;
  date: number; // timestamp
  unitNames: string;
  correct: number;
  total: number;
  totalTime: number; // seconds
  avgTime: number; // seconds
}

export type ThemeMode = 'light' | 'dark';
export type AppThemeColor = 'blue' | 'green' | 'pink' | 'red' | 'orange';

export interface ParseResult {
  words: WordItem[];
  errors: ParseError[];
  units: string[];
  categories: string[];
}

export interface ParseError {
  line: number;
  content: string;
  reason: 'TABLE_TOPILMADI' | 'UNIT_TOPILMADI' | 'CATEGORY_TOPILMADI' | 'EN_UZ_JUFTLIK_YO‘Q';
}

export enum TestDirection {
  EN_TO_UZ = 'EN_TO_UZ',
  UZ_TO_EN = 'UZ_TO_EN'
}

export enum ErrorMode {
  AT_END = 'AT_END',
  RANDOM = 'RANDOM'
}

export enum EndCondition {
  FINISH_ALL = 'FINISH_ALL',
  TIME = 'TIME',
  COUNT = 'COUNT'
}

export interface TestSettings {
  units: string[];
  category: string;
  direction: TestDirection;
  timerSeconds: number;
  optionCount: number;
  errorMode: ErrorMode;
  endCondition: EndCondition;
  limitValue?: number;
  percentage: number; // 0 to 100
}