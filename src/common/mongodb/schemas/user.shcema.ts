import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  role: string;

  @Prop({ type: Object, default: {} })
  details: object;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  reputationPoints: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
