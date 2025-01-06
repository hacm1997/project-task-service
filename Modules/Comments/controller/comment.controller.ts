import { JwtAuthGuard } from 'Modules/Auth/utils/jwt-auth.guard';
import { CommentService } from '../service/comment.service';
import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentDto } from '../util/commentDto.model';
import { CommentBase } from '../service/comment.base';
import { UserToClient } from 'Modules/Users/util/user.types';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:taskId')
  async createComment(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body() comment: CommentDto,
  ): Promise<CommentBase> {
    const user: UserToClient = req.user;
    return this.commentService.createComment(user, taskId, comment);
  }
}
