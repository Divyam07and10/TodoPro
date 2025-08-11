import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { TodoResponse } from '../types/todo-response.interface';
import { FilterTodoDto } from '../dto/filter-todo.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  private stripTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  async create(userId: string, dto: CreateTodoDto): Promise<TodoResponse> {
    const dueDate = new Date(dto.dueDate);
    const createdAt = new Date();

    const createdDay = this.stripTime(createdAt);
    const dueDay = this.stripTime(dueDate);

    if (dueDay.getTime() < createdDay.getTime()) {
      throw new BadRequestException('Due date must be today or a future date');
    }

    try {
      return await this.prisma.todo.create({
        data: {
          ...dto,
          userId,
          dueDate,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('title')
      ) {
        throw new ConflictException('A todo with this title already exists.');
      }
      throw error;
    }
  }

  async findAll(userId: string, filters: FilterTodoDto): Promise<TodoResponse[]> {
    const { search, priority, status, orderBy, category } = filters;

    const where: Prisma.TodoWhereInput = {
      userId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(priority && priority !== 'all' && { priority }),
      ...(category && category !== 'all' && { category }),
    };

    const today = this.stripTime(new Date());

    if (status && status !== 'all') {
      if (status === 'completed') {
        where.completed = true;
      } else if (status === 'pending') {
        where.completed = false;
        where.dueDate = { gte: today };
      } else if (status === 'overdue') {
        where.completed = false;
        where.dueDate = { lt: today };
      }
    }

    const orderByClause =
      orderBy === 'date-latest'
        ? { createdAt: Prisma.SortOrder.desc }
        : orderBy === 'date-oldest'
        ? { createdAt: Prisma.SortOrder.asc }
        : { createdAt: Prisma.SortOrder.desc };

    return this.prisma.todo.findMany({
      where,
      orderBy: orderByClause,
    });
  }

  async findOne(userId: string, id: string): Promise<TodoResponse> {
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(userId: string, id: string, dto: UpdateTodoDto): Promise<TodoResponse> {
    const todo = await this.findOne(userId, id);

    if (dto.dueDate) {
      const dueDate = new Date(dto.dueDate);
      const createdAt = new Date(todo.createdAt);

      const createdDay = this.stripTime(createdAt);
      const dueDay = this.stripTime(dueDate);

      if (dueDay.getTime() < createdDay.getTime()) {
        throw new BadRequestException('Due date must be same or after todo creation date.');
      }
    }

    try {
      return await this.prisma.todo.update({
        where: { id },
        data: {
          ...dto,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('title')
      ) {
        throw new ConflictException('Another todo with this title already exists.');
      }
      throw error;
    }
  }

  async delete(userId: string, id: string): Promise<{ message: string }> {
    await this.findOne(userId, id);

    await this.prisma.todo.delete({ where: { id } });
    return { message: 'Todo deleted successfully' };
  }
}
