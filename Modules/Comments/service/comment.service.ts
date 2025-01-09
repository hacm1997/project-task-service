import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommentRepository } from '../data/comment.repository';
import { CommentDto } from '../util/commentDto.model';
import { CommentBase } from './comment.base';
import { UserToClient } from 'Modules/Users/util/user.types';
import { CommentDocument } from 'src/common/mongodb/schemas/comments.schema';
import { GeneralResponse } from 'src/utils/types';

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

  async getCommentsByTaskId(taskId: string): Promise<CommentDocument[] | null> {
    const task = await this.commentRepository.findByTaskId(taskId);
    if (task.length === 0) {
      throw new HttpException('Tasks not found', HttpStatus.BAD_REQUEST);
    }
    return task;
  }

  async deleteComment(commentId: string): Promise<GeneralResponse> {
    try {
      await this.commentRepository.deleteById(commentId);
      return {
        message: 'comment deleted successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error('Error to delete comment:', error);
      throw new HttpException(
        'Error to delete comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
