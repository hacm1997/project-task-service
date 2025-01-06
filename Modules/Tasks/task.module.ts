import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../Users/user.module';
import { Task, TaskSchema } from 'src/common/mongodb/schemas/task.shcema';
import { TaskRepository } from 'Modules/Tasks/data/task.repository';
import { TaskService } from 'Modules/Tasks/service/task.service';
import { TaskController } from 'Modules/Tasks/controller/task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    UserModule,
  ],
  controllers: [TaskController],
  providers: [TaskRepository, TaskService],
  exports: [TaskService, MongooseModule],
})
export class TaskModule {}
