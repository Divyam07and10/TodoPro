import { IsOptional, IsIn } from 'class-validator';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  ORDER_BY_OPTIONS,
  CATEGORY_OPTIONS,
} from '../constants/filter-options';

export class FilterTodoDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsIn(PRIORITY_OPTIONS)
  priority?: (typeof PRIORITY_OPTIONS)[number];

  @IsOptional()
  @IsIn(STATUS_OPTIONS)
  status?: (typeof STATUS_OPTIONS)[number];

  @IsOptional()
  @IsIn(ORDER_BY_OPTIONS)
  orderBy?: (typeof ORDER_BY_OPTIONS)[number];

  @IsOptional()
  @IsIn(CATEGORY_OPTIONS)
  category?: (typeof CATEGORY_OPTIONS)[number];
}
