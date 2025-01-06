import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from '../data/comment.repository';
import { CommentDto } from '../util/commentDto.model';
import { CommentBase } from './comment.base';
import { UserToClient } from 'Modules/Users/util/user.types';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async createComment(
    user: UserToClient,
    taskId: string,
    comment: CommentDto,
  ): Promise<CommentBase> {
    try {
      const newComment = new CommentBase(
        comment.content,
        user.name,
        taskId,
        user.userId.toString(),
      );
      await this.commentRepository.createProject(newComment); // Save Comment
      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new HttpException('Error creating comment', HttpStatus.BAD_REQUEST);
    }
  }
}
