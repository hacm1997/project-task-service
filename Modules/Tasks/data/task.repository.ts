import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from 'src/common/mongodb/schemas/task.shcema';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';
import { TaskBase } from '../service/task.base';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

export class TaskRepository {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createTask(task: TaskBase): Promise<TaskDocument> {
    const createTask = new this.taskModel(task);
    return createTask.save();
  }

  async findAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().exec();
  }

  async findById(_id: string): Promise<TaskDocument | null> {
    return this.taskModel.findOne({ _id }).exec();
  }

  async findByProjectId(
    project: string,
    assignedTo: string,
  ): Promise<TaskDocument[]> {
    return this.taskModel.find({ project, assignedTo }).exec();
  }

  async deleteById(_id: string): Promise<boolean> {
    const result = await this.taskModel.findByIdAndDelete(_id).exec();
    return result !== null;
  }

  // Adding collaborators
  async addCollaborators(
    taskId: string,
    collaboratorIds: string[],
  ): Promise<Task> {
    // Find the task
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Verify that collaborator exists
    const collaborators = await this.userModel
      .find({
        _id: { $in: collaboratorIds },
      })
      .exec();
    if (collaborators.length !== collaboratorIds.length) {
      throw new NotFoundException('one or more collaborators not found');
    }

    // add collaborators to project
    task.collaborators.push(...collaboratorIds.map((id) => id as any));
    task.updatedAt = new Date();

    // save updated project
    return task.save();
  }

  async updateTask(
    taskId: string,
    title: string,
    description: string,
    dueDate: Date,
    status: string,
  ): Promise<Task> {
    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (status) task.status = status;

    task.updatedAt = new Date();
    return task.save();
  }
}
