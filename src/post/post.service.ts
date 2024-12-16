import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: number, dto: CreatePostDto) {
    const post = await this.prisma.posts.create({
      data: { authorId: userId, ...dto },
    });

    return {
      message: 'Blog post created successfully',
      post: { title: post.title, author: post.authorId },
    };
  }

  async getPost(userId: number) {
    const posts = await this.prisma.posts.findMany({
      where: {
        authorId: userId,
      },
    });

    return posts;
  }

  async getOnePost(userId: number, postId: number) {
    const post = await this.prisma.posts.findFirst({
      where: {
        id: +postId,
        authorId: userId,
      },
    });

    return post;
  }
}
