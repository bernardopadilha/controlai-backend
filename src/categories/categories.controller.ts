import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import type { User } from '../types/user.type';
import { CategoriesService } from './categories.service';
import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  @ApiOperation({ summary: 'Create category' })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Categoria criada com sucesso',
    example: {
      id: 'a187ab2b-b97a-484b-8dc3-d4e9619ab9f9',
      name: 'Comida',
      icon: '🍕',
      userId: '6dc4b3ed-e8f1-42a6-912d-a1fb88d348b3',
      createdAt: '2025-09-03T18:29:07.776Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Você já criou uma categoria com este nome',
    example: {
      message: 'Você já criou uma categoria com este nome',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(user, createCategoryDto);
  }

  @ApiOperation({ summary: 'Find all categories by userId' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Categorias retornado com sucesso',
    example: [
      {
        id: 'a187ab2b-b97a-484b-8dc3-d4e9619ab9f9',
        name: 'Comida',
        icon: '🍕',
        userId: '6dc4b3ed-e8f1-42a6-912d-a1fb88d348b3',
        createdAt: '2025-09-03T18:29:07.776Z',
      },
    ],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Get()
  findAllByUserId(@CurrentUser() user: User) {
    return this.categoriesService.findAllByUserId(user);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Categorias atualizado com sucesso',
    example: [
      {
        id: 'a187ab2b-b97a-484b-8dc3-d4e9619ab9f9',
        name: 'Comida',
        icon: '🍕',
        userId: '6dc4b3ed-e8f1-42a6-912d-a1fb88d348b3',
        createdAt: '2025-09-03T18:29:07.776Z',
      },
    ],
  })
  @ApiBadRequestResponse({
    description: 'Essa categoria não pertence ao seu usuário',
    example: {
      message: 'Essa categoria não pertence ao seu usuário',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Patch(':categoryId')
  update(
    @CurrentUser() user: User,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(user, categoryId, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Categoria deletada com sucesso' })
  @ApiBadRequestResponse({
    description: 'Essa categoria não pertence ao seu usuário',
    example: {
      message: 'Essa categoria não pertence ao seu usuário',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Delete(':categoryId')
  delete(@CurrentUser() user: User, @Param('categoryId') categoryId: string) {
    return this.categoriesService.delete(user, categoryId);
  }
}
