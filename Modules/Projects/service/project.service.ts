import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectBase } from './project.base';
import { ProjectRepository } from '../data/project.repository';
import { ProjectDocument } from 'src/common/mongodb/schemas/project.schema';
import { GeneralResponse } from 'src/utils/types';
import { TaskService } from 'Modules/Tasks/service/task.service';
import { TaskDto } from 'Modules/Tasks/util/taskDto.model';
import { UserToClient } from 'Modules/Users/util/user.types';

@Injectable()
export class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private readonly taskService: TaskService,
  ) {}

  async createProject(
    user: UserToClient,
    name: string,
    description: string,
    collaborators: string[] = [],
  ): Promise<ProjectBase> {
    try {
      collaborators.push(user.userId.toString());
      const project = new ProjectBase(
        name,
        description,
        user.userId,
        collaborators,
      );
      this.projectRepository.createProject(project); // Save Project
      return project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new HttpException('Error creating project', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllProjects(): Promise<ProjectDocument[]> {
    const projects = await this.projectRepository.findAll();
    // Mapear los resultados a ProjectBase si es necesario
    return projects.map((project: ProjectDocument) => project);
  }

  // Método para obtener un proyecto por su ID
  async getProjectById(id: string): Promise<ProjectBase | null> {
    const project = await this.projectRepository.findById(id);
    if (!project) return null;
    return this.mapToProjectBase(project);
  }

  async addCollaborator(
    projectId: string,
    collaboratorId: string[],
  ): Promise<GeneralResponse> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    await this.projectRepository.addCollaborators(projectId, collaboratorId);
    return { message: 'Collaborator added success', status: HttpStatus.OK };
  }

  async removeCollaborator(
    projectId: string,
    collaboratorId: string,
  ): Promise<GeneralResponse> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.projectRepository.removeCollaborator(
        projectId,
        collaboratorId,
      );
      return { message: 'Collaborator removed success', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error removing collaborator:', error);
      throw new HttpException(
        'Can not remove collaborator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addTask(projectId: string, task: TaskDto): Promise<GeneralResponse> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    try {
      const newTask = await this.taskService.createTask(task);
      await this.projectRepository.addTask(projectId, newTask._id.toString());
      return { message: 'Task added success', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error adding task:', error);
      throw new HttpException('Can not added task', HttpStatus.BAD_REQUEST);
    }
  }

  async removeTask(
    projectId: string,
    taskId: string,
  ): Promise<GeneralResponse> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    await this.projectRepository.removeTask(projectId, taskId);
    await this.taskService.removerById(taskId);
    return { message: 'Task removed success', status: HttpStatus.OK };
  }

  async updateProject(
    projectId: string,
    name: string,
    description: string,
  ): Promise<GeneralResponse> {
    const project = await this.getProjectById(projectId);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.projectRepository.updateProject(projectId, name, description);
      return { message: 'Project updated successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error to update project:', error);
      throw new HttpException(
        'Error to update project',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private mapToProjectBase(project: ProjectDocument): ProjectBase {
    return new ProjectBase(
      project.name,
      project.description,
      project.owner.toString(),
      project.collaborators.map((collaborator) => collaborator.toString()),
      project.tasks.map((task) => task.toString()),
    );
  }
}
