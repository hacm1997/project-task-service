import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { ProjectService } from '../service/project.service';
import { ProjectModelDto } from '../util/projectDto.model';
import { ProjectBase } from '../service/project.base';
import { JwtAuthGuard } from 'src/Models/Auth/utils/jwt-auth.guard';
import { UserToClient } from 'src/Models/Users/util/user.types';
import { ProjectDocument } from 'src/common/mongodb/schemas/project.schema';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(
    @Request() req,
    @Body() projectDto: ProjectModelDto, // Recibe el DTO para validación
  ): Promise<ProjectBase> {
    const { name, description, collaborators } = projectDto;
    const user: UserToClient = req.user;
    return this.projectService.createProject(
      user,
      name,
      description,
      collaborators,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProjects(): Promise<ProjectDocument[]> {
    return this.projectService.getAllProjects();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getProjectById(@Param('id') id: string): Promise<ProjectBase> {
    return this.projectService.getProjectById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('collaborators')
  async addCollaborator(
    @Body() projectData: { projectId: string; collaboratorId: string[] },
  ): Promise<{ message: string; status: number }> {
    return this.projectService.addCollaborator(
      projectData.projectId,
      projectData.collaboratorId,
    );
  }
}
