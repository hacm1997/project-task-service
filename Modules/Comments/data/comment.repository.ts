import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/common/mongodb/schemas/comments.schema';
import { CommentBase } from '../service/comment.base';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createProject(comment: CommentBase): Promise<Comment> {
    const createComment = new this.commentModel(comment);
    return createComment.save();
  }

  async findByTaskId(task: string): Promise<CommentDocument[]> {
    const query = { task };
    return this.commentModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async deleteById(_id: string): Promise<CommentDocument> {
    const result = await this.commentModel.findByIdAndDelete(_id).exec();
    if (!result) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }
}
