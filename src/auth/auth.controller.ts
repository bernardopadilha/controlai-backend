import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { User } from '@prisma/client';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-in')
  @Public()
  @ApiOperation({ summary: 'Sign-in' })
  @ApiBody({ type: SignInDto })
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
    description: 'Email ou senha incorretos',
    example: {
      message: 'Email ou senha incorretos',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @Public()
  @ApiOperation({ summary: 'Sign-up' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Conta criada com sucesso',
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
    description: 'Email já cadastrado',
    example: {
      message: 'Email já cadastrado',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  signUp(@Body() signUpDto: CreateUserDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtém dados do usuário logado' })
  @ApiOkResponse({
    description: 'Dados do usuário logado',
    example: {
      id: 'bc779472-5511-4791-94f0-9150642fe1f0',
      name: 'Bernardo Padilha',
      email: 'bernardoa.padilha@gmail.com',
    },
  })
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
