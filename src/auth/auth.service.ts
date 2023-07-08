import { Injectable, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signUp() {
    return { msg: 'I am sign up' };
  }

  signIn() {
    return { msg: 'I am sign in' };
  }
}
