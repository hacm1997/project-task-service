import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Project,
  ProjectDocument,
} from 'src/common/mongodb/schemas/project.schema';
import { ProjectBase } from '../service/project.base';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';
import { ProjectQuery } from '../util/project.types';

export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createProject(project: ProjectBase): Promise<Project> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: {
      name?: string;
      description?: string;
    } = {},
  ): Promise<{
    data: ProjectDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { name, description } = filters;

    const query: ProjectQuery = {};
    if (name) query.name = new RegExp(name, 'i');
    if (description) query.description = new RegExp(description, 'i');

    const total = await this.projectModel.countDocuments(query).exec();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await this.projectModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, total, page, totalPages };
  }

  async findAllByCollaborators(
    collaborators: string[],
  ): Promise<ProjectDocument[]> {
    return this.projectModel
      .find({ collaborators: { $in: collaborators } })
      .exec();
  }

  async findById(_id: string): Promise<ProjectDocument | null> {
    // return this.projectModel
    //   .findOne({ _id })
    //   .populate('collaborators', '_id', 'name')
    //   .exec();
    const project = await this.projectModel
      .findOne({ _id })
      .populate('collaborators', 'name')
      .exec();
    return project;
  }

  // Adding collaborators
  async addCollaborators(
    projectId: string,
    collaboratorIds: string[],
  ): Promise<Project> {
    // Find the project
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException('Prohject not found');
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

    const newCollaborators = collaboratorIds.filter(
      (id) => !project.collaborators.includes(id),
    );

    if (newCollaborators.length === 0) {
      throw new NotFoundException('some collaborators are already added');
    }
    // add collaborators to project
    project.collaborators.push(...collaboratorIds.map((id) => id as any));
    project.updatedAt = new Date();

    // save updated project
    return project.save();
  }

  // Remove collaborators from project
  async removeCollaborator(
    projectId: string,
    collaboratorId: string,
  ): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    project.collaborators = project.collaborators.filter(
      (id) => id.toString() !== collaboratorId,
    );
    project.updatedAt = new Date();
    await project.save();
  }

  async addTask(projectId: string, taskId: string): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    if (!project.tasks.some((tsk) => tsk.toString() === taskId)) {
      project.tasks.push(taskId);
      project.updatedAt = new Date();
      await project.save();
    }
  }

  async removeTask(projectId: string, taskId: string): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    const verifyTask = project.tasks.filter((id) => id.toString() === taskId);
    if (verifyTask.length === 0) {
      throw new HttpException(
        'Task not found in project',
        HttpStatus.NOT_FOUND,
      );
    }

    project.tasks = project.tasks.filter((id) => id.toString() !== taskId);

    project.updatedAt = new Date();
    await project.save();
  }

  async updateProject(
    projectId: string,
    name: string,
    description: string,
  ): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    if (name) project.name = name;
    if (description) project.description = description;

    project.updatedAt = new Date();
    await project.save();
  }

  async deleteProject(projectId: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findByIdAndDelete(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }
}
