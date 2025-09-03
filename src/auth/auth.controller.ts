import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import type { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @ApiOperation({ summary: 'Fazer login' })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'bc779472-5511-4791-94f0-9150642fe1f0',
        name: 'Bernardo Padilha',
        email: 'bernardoa.padilha@gmail.com',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    example: {
      message: 'Credenciais inválidas',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({ summary: 'Fazer login' })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso',
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'bc779472-5511-4791-94f0-9150642fe1f0',
        name: 'Bernardo Padilha',
        email: 'bernardoa.padilha@gmail.com',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Usuário já existe',
    example: {
      message: 'Este email já é cadastrado',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }
}
