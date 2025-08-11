import {
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Priority, Category } from '@prisma/client';
import { Type } from 'class-transformer';
import { Trim, Escape } from 'class-sanitizer';
export class UpdateTodoDto {
  
  @Trim()
  @Escape()
  @IsOptional()
  @IsString()
  title?: string;

  @Trim()
  @Escape()
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
