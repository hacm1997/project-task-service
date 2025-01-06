import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/common/mongodb/schemas/project.schema';
import { ProjectController } from 'Modules/Projects/controller/project.controller';
import { ProjectRepository } from 'Modules/Projects/data/project.repository';
import { ProjectService } from 'Modules/Projects/service/project.service';
import { UserModule } from '../Users/user.module';
import { TaskRepository } from 'Modules/Tasks/data/task.repository';
import { TaskModule } from '../Tasks/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UserModule,
    TaskModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository, TaskRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
