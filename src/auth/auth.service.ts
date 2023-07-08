import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {
  }
  signIn() {
    return { msg: 'I am sign in' };
  }

  signUp() {
    return { msg: 'I am sign up' };
  }
}
