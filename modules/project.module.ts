import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
} from 'src/common/mongodb/schemas/project.schema';
import { ProjectController } from 'src/Models/Projects/controller/project.controller';
import { ProjectRepository } from 'src/Models/Projects/data/project.repository';
import { ProjectService } from 'src/Models/Projects/service/project.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UserModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService],
})
export class ProjectModule {}
