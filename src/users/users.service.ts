import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const findUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findUser) throw new BadRequestException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return user;
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });

    if (!user)
      throw new BadRequestException(
        'Não foi possível encontrar o usuário em nossa base de dados',
      );

    return user;
  }
}
