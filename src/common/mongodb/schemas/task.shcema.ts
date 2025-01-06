import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
    enum: ['all', 'in-progress', 'completed'],
    default: 'all',
  })
  status: string;

  // Project relationship
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  project: string;

  // User relationship
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  assignedTo: string;

  // Collaborators users (array)
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User' }])
  collaborators: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
