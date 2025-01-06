import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { Task, TaskDocument } from 'src/common/mongodb/schemas/task.shcema';
import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';
import { UserToClient } from 'Modules/Users/util/user.types';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:projectId')
  async getTaskByProjectId(
    @Request() req,
    @Param('projectId') projectId: string,
  ): Promise<TaskDocument[]> {
    const user: UserToClient = req.user;
    return this.taskService.getTaskByProjectId(
      projectId,
      user.userId.toString(),
    );
  }

  @Put('/:taskId')
  async updateTask(
    @Param('taskId') taskId: string,
    @Body()
    task: {
      title?: string;
      description?: string;
      dueDate?: Date;
      status?: string;
    },
  ): Promise<Task> {
    return this.taskService.updateTask(
      taskId,
      task.title,
      task.description,
      task.dueDate,
      task.status,
    );
  }
}
