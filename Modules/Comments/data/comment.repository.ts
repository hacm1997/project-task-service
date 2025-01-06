import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Comment,
  CommentDocument,
} from 'src/common/mongodb/schemas/comments.schema';
import { CommentBase } from '../service/comment.base';

export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createProject(comment: CommentBase): Promise<Comment> {
    const createComment = new this.commentModel(comment);
    return createComment.save();
  }
}
