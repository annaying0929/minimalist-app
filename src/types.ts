export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type EntryType = 'bought' | 'discarded';
export type DiscardMethod = 'thrown' | 'donated';

export interface Entry {
  id: string;
  type: EntryType;
  categoryId: string;
  name: string;
  quantity: number;
  estimatedValue: number;
  discardMethod: DiscardMethod | null; // null for bought entries
  donationValue: number;               // estimated charity resale (only when donated)
  date: string;
}

export interface AppState {
  entries: Entry[];
}
