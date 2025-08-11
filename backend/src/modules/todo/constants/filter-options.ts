import { Priority, Category } from '@prisma/client';

export const PRIORITY_OPTIONS: (Priority | 'all')[] = ['high', 'medium', 'low', 'all'];
export const STATUS_OPTIONS = ['completed', 'pending', 'overdue', 'all'] as const;
export const ORDER_BY_OPTIONS = ['date-latest', 'date-oldest'] as const;
export const CATEGORY_OPTIONS: (Category | 'all')[] = [
  'work',
  'personal',
  'health',
  'finance',
  'education',
  'other',
  'all',
];
