import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() dto: AuthDto) {
    console.log(dto);
    this.authService.signUp();
  }

  @Post('/signin')
  signIn() {
    this.authService.signIn();
  }
}
