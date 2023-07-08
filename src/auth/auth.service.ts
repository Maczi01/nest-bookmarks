import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signIn() {
    return { msg: 'I am sign in' };
  }

  signUp() {
    return { msg: 'I am sign up' };
  }
}
