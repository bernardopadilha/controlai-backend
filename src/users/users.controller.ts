import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { User } from '../types/user.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiCreatedResponse({
    description: 'Usuário criado com sucesso',
    example: {
      id: 'bc779472-5511-4791-94f0-9150642fe1f0',
      name: 'Bernardo Padilha',
      email: 'bernardoa.padilha@gmail.com',
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
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista usuário por ID' })
  @ApiOkResponse({
    description: 'Usuário listado com sucesso',
    example: {
      id: 'bc779472-5511-4791-94f0-9150642fe1f0',
      name: 'Bernardo Padilha',
      email: 'bernardoa.padilha@gmail.com',
    },
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado',
    example: {
      message: 'Não foi possível encontrar o usuário em nossa base de dados',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get('me')
  @ApiBearerAuth()
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
