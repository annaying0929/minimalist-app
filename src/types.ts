export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type EntryType = 'bought' | 'discarded';

export interface Entry {
  id: string;
  type: EntryType;
  categoryId: string;
  name: string;
  quantity: number;
  estimatedValue: number;
  date: string;
}

export interface AppState {
  entries: Entry[];
}
