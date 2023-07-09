import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signUp(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('Prisma error', error?.message);
        console.log('Prisma code', error?.code);
        throw new ForbiddenException('Credentials taken, try different email');
      }
      console.log('Other error', error?.message);
      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) {
      throw new ForbiddenException(
        'Incorrect credentials, check email or password',
      );
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const options = {
      expiresIn: '15m',
      secret: secret,
    };
    const token = await this.jwt.signAsync(payload, options);
    return {
      accessToken: token,
    };
  }
}
