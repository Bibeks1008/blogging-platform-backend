import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: AuthDto) {
    const hashedPwd = await bcrypt.hash(dto.password, 12);

    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email.toLocaleLowerCase().trim(),
          password: hashedPwd,
        },
      });

      delete user.password;
      return { message: 'User created successfully!' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    const email = dto.email.toLocaleLowerCase().trim();
    const password = dto.password;

    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return this.signinToken(user.id, user.email);
  }

  async signinToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string; userId: number }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: this.config.get('JWT_SECRET'),
    });

    return { access_token: token, userId: userId };
  }
}
