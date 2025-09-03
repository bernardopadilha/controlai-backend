import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import type { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signIn(signInDto: SignInDto) {
    if (!signInDto || !signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const { email, password } = signInDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Email ou senha incorretos');

    const isPasswordValid = await bcrypt.compare(
      password,
      String(user.password),
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Email ou senha incorretos');

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async signUp(signUpDto: CreateUserDto) {
    const { name, email, password } = signUpDto;

    const user = await this.usersService.create({
      name,
      email,
      password,
    });

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user,
    };
  }

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId);
  }
}
