import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../types/user.type';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(user: User, createCategoryDto: CreateCategoryDto) {
    const { icon, name } = createCategoryDto;

    const findCategory = await this.prisma.category.findUnique({
      where: {
        name_userId: {
          name,
          userId: user.id,
        },
      },
    });

    if (findCategory) {
      throw new BadRequestException(
        'Você já criou uma categoria com este nome',
      );
    }

    return await this.prisma.category.create({
      data: {
        name,
        icon,
        userId: user.id,
      },
    });
  }

  async findAllByUserId(user: User) {
    return await this.prisma.category.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async update(
    user: User,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const { icon, name } = updateCategoryDto;

    const userIsOwner = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!userIsOwner) {
      throw new BadRequestException(
        'Essa categoria não pertence ao seu usuário',
      );
    }

    return await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
        icon,
      },
    });
  }

  async delete(user: User, categoryId: string) {
    const userIsOwner = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
        userId: user.id,
      },
    });

    if (!userIsOwner) {
      throw new BadRequestException(
        'Essa categoria não pertence ao seu usuário',
      );
    }

    await this.prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
