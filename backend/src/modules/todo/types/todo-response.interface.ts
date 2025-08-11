import { Priority, Category } from '@prisma/client';

export interface TodoResponse {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  completed: boolean;
}
