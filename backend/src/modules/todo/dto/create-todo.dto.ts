import {
  IsString,
  IsEnum,
  IsDate,
  IsNotEmpty,
} from 'class-validator';
import { Priority, Category } from '@prisma/client';
import { Type } from 'class-transformer';
import { Escape, Trim } from 'class-sanitizer';

export class CreateTodoDto {
  @Trim()
  @Escape()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Trim()
  @Escape()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  dueDate: Date;
}
