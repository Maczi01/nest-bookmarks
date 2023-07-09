import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.signUp(dto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
