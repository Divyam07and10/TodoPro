import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RequestWithUser } from 'src/modules/auth/types/request-with-user.interface';
import { FilterTodoDto } from '../dto/filter-todo.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@UseGuards(ApiKeyGuard, JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  //Create new todo
  @Post()
  create(@Body() dto: CreateTodoDto, @Req() req: RequestWithUser) {
    return this.todoService.create(req.user.sub, dto);
  }

  //Get all todos of user
  @Get()
  findAll(@Req() req: RequestWithUser, @Query() filters: FilterTodoDto) {
    return this.todoService.findAll(req.user.sub, filters);
  }

  //Get todo by id
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.todoService.findOne(req.user.sub, id);
  }

  //Update todo
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.todoService.update(req.user.sub, id, dto);
  }

  //Delete todo
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.todoService.delete(req.user.sub, id);
  }
}
