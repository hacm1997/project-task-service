import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
// import { User } from './user.shcema';
// import { Task } from './task.shcema';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: string; // Usuario que creó el proyecto

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  collaborators: string[]; // Usuarios asignados al proyecto

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Task' }])
  tasks: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
