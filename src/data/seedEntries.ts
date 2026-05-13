import type { Entry } from '../types'

// Realistic entries for a London household demo — baby's first year clear-out
export const SEED_ENTRIES: Entry[] = [
  // February — big clear-out as baby grew out of early clothes
  { id: 's1',  type: 'discarded', categoryId: 'clothing-baby',   name: '0–3 month bodysuits',   quantity: 8, estimatedValue: 0,  discardMethod: 'donated', donationValue: 20, saleValue: 0, date: '2026-02-04T10:00:00.000Z' },
  { id: 's2',  type: 'discarded', categoryId: 'clothing-adults', name: 'Old hoodies',            quantity: 3, estimatedValue: 0,  discardMethod: 'donated', donationValue: 15, saleValue: 0, date: '2026-02-08T10:00:00.000Z' },
  { id: 's3',  type: 'discarded', categoryId: 'books',           name: 'Pregnancy books',        quantity: 4, estimatedValue: 0,  discardMethod: 'donated', donationValue: 10, saleValue: 0, date: '2026-02-12T10:00:00.000Z' },
  { id: 's4',  type: 'bought',    categoryId: 'clothing-baby',   name: '6–9 month grows ×5',    quantity: 5, estimatedValue: 22, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-02-14T10:00:00.000Z' },
  { id: 's5',  type: 'bought',    categoryId: 'books',           name: 'Sleep training guide',   quantity: 1, estimatedValue: 12, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-02-18T10:00:00.000Z' },
  { id: 's6',  type: 'bought',    categoryId: 'baby-gear',       name: 'Bouncer seat',           quantity: 1, estimatedValue: 65, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-02-22T10:00:00.000Z' },

  // March — second wave of baby clothes, adults decluttering
  { id: 's7',  type: 'discarded', categoryId: 'clothing-baby',   name: '3–6 month grows',        quantity: 6, estimatedValue: 0,  discardMethod: 'donated', donationValue: 18, saleValue: 0, date: '2026-03-03T10:00:00.000Z' },
  { id: 's8',  type: 'discarded', categoryId: 'clothing-adults', name: 'Summer dresses',         quantity: 2, estimatedValue: 0,  discardMethod: 'donated', donationValue: 12, saleValue: 0, date: '2026-03-07T10:00:00.000Z' },
  { id: 's9',  type: 'discarded', categoryId: 'shoes',           name: 'Old trainers',           quantity: 1, estimatedValue: 0,  discardMethod: 'thrown',  donationValue: 0,  saleValue: 0, date: '2026-03-10T10:00:00.000Z' },
  { id: 's10', type: 'discarded', categoryId: 'kitchen',         name: 'Duplicate gadgets',      quantity: 2, estimatedValue: 0,  discardMethod: 'donated', donationValue: 5,  saleValue: 0, date: '2026-03-14T10:00:00.000Z' },
  { id: 's11', type: 'bought',    categoryId: 'clothing-adults', name: 'Autumn jumpers ×2',      quantity: 2, estimatedValue: 35, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-03-17T10:00:00.000Z' },
  { id: 's12', type: 'bought',    categoryId: 'clothing-baby',   name: 'Winter coat',            quantity: 1, estimatedValue: 45, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-03-21T10:00:00.000Z' },
  { id: 's13', type: 'bought',    categoryId: 'kitchen',         name: 'Bamboo cutting boards',  quantity: 2, estimatedValue: 18, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-03-25T10:00:00.000Z' },
  { id: 's14', type: 'bought',    categoryId: 'electronics',     name: 'Bluetooth speaker',      quantity: 1, estimatedValue: 79, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-03-28T10:00:00.000Z' },

  // April — slower month, a few new purchases
  { id: 's15', type: 'discarded', categoryId: 'books',           name: 'Old cookbooks',          quantity: 3, estimatedValue: 0,  discardMethod: 'donated', donationValue: 8,  saleValue: 0, date: '2026-04-05T10:00:00.000Z' },
  { id: 's16', type: 'bought',    categoryId: 'clothing-adults', name: 'Work trousers',          quantity: 1, estimatedValue: 60, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-04-10T10:00:00.000Z' },
  { id: 's17', type: 'bought',    categoryId: 'toys',            name: 'Stacking rings',         quantity: 1, estimatedValue: 15, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-04-15T10:00:00.000Z' },
  { id: 's18', type: 'bought',    categoryId: 'bedding',         name: 'Cot sheets set ×3',      quantity: 3, estimatedValue: 25, discardMethod: null,      donationValue: 0,  saleValue: 0, date: '2026-04-20T10:00:00.000Z' },
]
