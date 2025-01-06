import { Module } from '@nestjs/common';
import { CommentRepository } from './data/comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comment,
  CommentSchema,
} from 'src/common/mongodb/schemas/comments.schema';
import { UserModule } from 'Modules/Users/user.module';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './service/comment.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
  exports: [],
})
export class CommentModule {}
