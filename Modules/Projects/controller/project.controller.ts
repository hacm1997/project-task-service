import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { ProjectModelDto } from '../util/projectDto.model';
import { ProjectBase } from '../service/project.base';
import { ProjectDocument } from 'src/common/mongodb/schemas/project.schema';
import { GeneralResponse } from 'src/utils/types';
import { TaskDto } from 'Modules/Tasks/util/taskDto.model';
import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';
import { UserToClient } from 'Modules/Users/util/user.types';
import { ROLE_1 } from 'src/common/constants/const';

@UseGuards(JwtAuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(
    @Request() req,
    @Body() projectDto: ProjectModelDto, // Recibe el DTO para validación
  ): Promise<ProjectBase> {
    const { name, description, collaborators } = projectDto;
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.createProject(
        user,
        name,
        description,
        collaborators,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get()
  async getAllProjects(@Request() req): Promise<ProjectDocument[]> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.getAllProjects();
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('/:id')
  async getProjectById(@Param('id') id: string): Promise<ProjectBase> {
    return this.projectService.getProjectById(id);
  }

  @Post('collaborators')
  async addCollaborator(
    @Request() req,
    @Body() projectData: { projectId: string; collaboratorId: string[] },
  ): Promise<GeneralResponse> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.addCollaborator(
        projectData.projectId,
        projectData.collaboratorId,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('/:projectId')
  async updateProject(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() projectData: { name: string; description: string },
  ): Promise<GeneralResponse> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.updateProject(
        projectId,
        projectData.name,
        projectData.description,
      );
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('collaborators/remove/:projectId/:collaboratorId')
  async removeCollaborator(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('collaboratorId') collaboratorId: string,
  ): Promise<GeneralResponse> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.removeCollaborator(projectId, collaboratorId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('tasks/:projectId')
  async addTask(
    @Request() req,
    @Param('projectId') projectId: string,
    @Body() taskData: TaskDto,
  ): Promise<GeneralResponse> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      const buildTask: TaskDto = {
        ...taskData,
        project: projectId,
        assignedTo: user.userId.toString(),
      };
      return this.projectService.addTask(projectId, buildTask);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('tasks/remove/:projectId/:taskId')
  async removeTask(
    @Request() req,
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
  ): Promise<GeneralResponse> {
    const user: UserToClient = req.user;
    if (user.role === ROLE_1) {
      return this.projectService.removeTask(projectId, taskId);
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}