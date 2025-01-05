import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Project } from './project.schema';
import { User } from './user.shcema';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({
    required: true,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo',
  })
  status: string;

  // Project relationship
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: Project;

  // User relationship
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  assignedTo: User;

  // Collaborators users (array)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  collaborators: User[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
