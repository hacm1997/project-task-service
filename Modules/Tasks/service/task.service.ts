import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskRepository } from '../data/task.repository';
import { TaskBase } from './task.base';
import { Task, TaskDocument } from 'src/common/mongodb/schemas/task.shcema';
import { TaskDto } from '../util/taskDto.model';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  public async createTask(task: TaskDto): Promise<TaskDocument> {
    try {
      const newTask = new TaskBase(
        task.title,
        task.description,
        task.dueDate,
        task.project,
        task.assignedTo,
        task.collaborators ?? [],
        task.status as 'all' | 'in-progress' | 'completed',
      );
      const taskCreated = this.taskRepository.createTask(newTask); // Save Task
      return taskCreated;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new HttpException('Error creating task', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllTasks(title?: string): Promise<TaskDocument[]> {
    const tasks = await this.taskRepository.findAll(title);
    return tasks;
  }

  async getTaskById(taskId: string): Promise<TaskDocument | null> {
    const task = await this.taskRepository.findById(taskId);
    if (!task) return null;
    return task;
  }

  async getTaskByProjectId(
    projectId: string,
    title?: string,
  ): Promise<TaskDocument[] | null> {
    const task = await this.taskRepository.findByProjectId(projectId, title);
    if (task.length === 0) {
      throw new HttpException('Tasks not found', HttpStatus.BAD_REQUEST);
    }
    return task;
  }

  async removerById(taskId: string): Promise<boolean> {
    const result = await this.taskRepository.deleteById(taskId);
    return result;
  }

  async updateTask(
    taskId: string,
    title?: string,
    description?: string,
    dueDate?: Date,
    status?: string,
    assignedTo?: string,
  ): Promise<Task> {
    const updateTask = await this.taskRepository.updateTask(
      taskId,
      title,
      description,
      dueDate,
      status,
      assignedTo,
    );
    return updateTask;
  }

  private mapToTaskBase(task: TaskDocument): TaskBase {
    return new TaskBase(
      task.title,
      task.description,
      task.dueDate,
      task.project.toString(),
      task.assignedTo.toString(),
      task.collaborators.map((collaborator) => collaborator.toString()),
      task.status as 'all' | 'in-progress' | 'completed',
    );
  }
}
