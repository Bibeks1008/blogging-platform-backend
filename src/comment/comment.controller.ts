import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { AddCommentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':postId/comments')
  addCommentToPost(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: AddCommentDto,
  ) {
    return this.commentService.addCommentToPost(userId, postId, dto);
  }

  @Get(':postId/comments')
  getAllCommentsOfPost(
    @GetUser('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.commentService.getAllCommentsOfPost(userId, postId);
  }
}
