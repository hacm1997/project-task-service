import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Project,
  ProjectDocument,
} from 'src/common/mongodb/schemas/project.schema';
import { ProjectBase } from '../service/project.base';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/common/mongodb/schemas/user.shcema';

export class ProjectRepository {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  public async createProject(project: ProjectBase): Promise<Project> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  public async findAll(): Promise<ProjectDocument[]> {
    return this.projectModel.find().exec();
  }

  public async findById(_id: string): Promise<ProjectDocument | null> {
    return this.projectModel.findOne({ _id }).exec();
  }

  // Método para añadir un colaborador
  async addCollaborators(
    projectId: string,
    collaboratorIds: string[],
  ): Promise<Project> {
    // Buscar el proyecto
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Verificar si los colaboradores existen
    const collaborators = await this.userModel
      .find({
        _id: { $in: collaboratorIds },
      })
      .exec();
    if (collaborators.length !== collaboratorIds.length) {
      throw new NotFoundException('Uno o más colaboradores no encontrados');
    }

    // Agregar los colaboradores al proyecto
    project.collaborators.push(...collaboratorIds.map((id) => id as any));
    project.updatedAt = new Date();

    // Guardar el proyecto actualizado
    return project.save();
  }

  // Método para eliminar un colaborador
  public async removeCollaborator(
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
    await project.save();
  }

  // Método para añadir una tarea
  public async addTask(projectId: string, taskId: string): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    if (!project.tasks.some((task) => task.toString() === taskId)) {
      project.tasks.push(taskId as any);
      await project.save();
    }
  }

  // Método para eliminar una tarea
  public async removeTask(projectId: string, taskId: string): Promise<void> {
    const project = await this.projectModel.findById(projectId).exec();
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    project.tasks = project.tasks.filter((id) => id.toString() !== taskId);
    await project.save();
  }

  // Método para actualizar un proyecto
  public async updateProject(
    projectId: string,
    name?: string,
    description?: string,
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
}