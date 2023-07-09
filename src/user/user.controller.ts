import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  @HttpCode(HttpStatus.CREATED)
  getLoggedUserInfo(@GetUser() user: User) {
    return user;
  }

  @Get()
  getUsers() {
    return [];
  }
}
