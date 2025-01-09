import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from '../service/task.service';
import { Task, TaskDocument } from 'src/common/mongodb/schemas/task.shcema';
import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:projectId')
  async getTaskByProjectId(
    @Param('projectId') projectId: string,
    @Query('title') title: string,
  ): Promise<TaskDocument[]> {
    return this.taskService.getTaskByProjectId(projectId, title);
  }

  @Get('search')
  async searchTasks(@Query('title') title: string): Promise<TaskDocument[]> {
    return this.taskService.getAllTasks(title);
  }

  @Get('/by-id/:taskId')
  async searchTasksbyId(
    @Param('taskId') taskId: string,
  ): Promise<TaskDocument> {
    return this.taskService.getTaskById(taskId);
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
      assignedTo?: string;
    },
  ): Promise<Task> {
    return this.taskService.updateTask(
      taskId,
      task.title,
      task.description,
      task.dueDate,
      task.status,
      task.assignedTo,
    );
  }
}
