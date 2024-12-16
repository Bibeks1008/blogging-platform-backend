import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';
import { CreatePostDto } from './dto';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    console.log(userId);
    return this.postService.createPost(userId, dto);
  }

  @Get()
  getPost(@GetUser('id') userId: number) {
    return this.postService.getPost(userId);
  }

  @Get(':id')
  getOnePost(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    console.log(postId);
    return this.postService.getOnePost(userId, postId);
  }
}
