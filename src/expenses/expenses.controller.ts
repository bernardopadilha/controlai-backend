import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import type { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) { }

  @ApiOperation({ summary: 'Create expense' })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Expense criado com sucesso',
    example: {
      id: '4af9842c-7ebf-4c3b-bc2b-21ac64462b76',
      amount: 400000,
      description: 'Aluguel casa',
      date: '2025-08-28T03:00:00.000Z',
      userId: '6dc4b3ed-e8f1-42a6-912d-a1fb88d348b3',
      categoryId: '5c4a6147-1557-40bc-a87c-02e5d7d39cba',
      createdAt: '2025-09-03T21:33:29.039Z',
      updatedAt: '2025-09-03T21:33:29.039Z',
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
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(user, createExpenseDto);
  }

  @ApiOperation({ summary: 'Get total expenses' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Total de despesas retornado com sucesso',
    example: {
      _sum: {
        amount: 800000,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Insira os campos from e to como queryParams',
    example: {
      message: 'from e to são query parameters necessários',
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
  @Get('/balance/total')
  getTotalExpenses(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException(
        'from e to são query parameters necessários',
      );
    }

    return this.expensesService.getTotalExpenses(
      user,
      new Date(from),
      new Date(to),
    );
  }

  @ApiOperation({ summary: 'Get expenses per categories' })
  @ApiBearerAuth()
  @ApiBadRequestResponse({
    description: 'Insira os campos from e to como queryParams',
    example: {
      message: 'from e to são query parameters necessários',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiOkResponse({
    description: 'Despesas por categoria retornado com sucesso',
    example: [
      {
        category: 'Aluguel',
        categoryIcon: '🏠',
        type: 'expense',
        _sum: {
          amount: 800000,
        },
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
  @Get('/balance/per-categories')
  getExpensesPerCategories(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException(
        'from e to são query parameters necessários',
      );
    }

    return this.expensesService.getExpensesPerCategories(
      user,
      new Date(from),
      new Date(to),
    );
  }

  @ApiOperation({ summary: 'Find all expenses by user id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Despesas listadas com sucesso',
    example: [
      {
        id: '94db82fc-96cd-453c-a8a2-43145c619f3f',
        amount: 400000,
        description: 'Aluguel casa',
        date: '2025-08-28T03:00:00.000Z',
        userId: '6dc4b3ed-e8f1-42a6-912d-a1fb88d348b3',
        categoryId: '5c4a6147-1557-40bc-a87c-02e5d7d39cba',
        createdAt: '2025-09-03T21:32:15.921Z',
        updatedAt: '2025-09-03T21:32:15.921Z',
      },
    ],
  })
  @ApiBadRequestResponse({
    description: 'Insira os campos from e to como queryParams',
    example: {
      message: 'from e to são query parameters necessários',
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
  @Get()
  findAllExpensesByUserId(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new BadRequestException(
        'from e to são query parameters necessários',
      );
    }

    return this.expensesService.findAllExpensesByUserId(
      user,
      new Date(from),
      new Date(to),
    );
  }

  @ApiOperation({ summary: 'Get history periods' })
  @ApiBearerAuth()
  @Get('/history/periods')
  getHistoryPeriod(@CurrentUser() user: User) {
    return this.expensesService.getHistoryPeriod(user);
  }

  @ApiOperation({ summary: 'Get history expenses' })
  @ApiBearerAuth()
  @Get('/history')
  getExpenseHistory(
    @CurrentUser() user: User,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.expensesService.getExpenseHistory(
      user,
      new Date(from),
      new Date(to),
    );
  }

  @ApiOperation({ summary: 'Get history expenses' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Histórico retornado com sucesso',
    example: [
      {
        expense: 0,
        month: 9,
        year: 2025,
        day: 1,
      },
      '...',
    ],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Get('history-data')
  getHistoryData(
    @CurrentUser() user: User,
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('timeframe') timeframe: 'month' | 'year',
  ) {
    const parsedMonth = Number(month) + 1;
    return this.expensesService.getHistoryData(
      user,
      Number(year),
      timeframe,
      parsedMonth,
    );
  }

  @ApiOperation({ summary: 'Delete expense' })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Despesa deletada com sucesso' })
  @ApiBadRequestResponse({
    description: 'Essa despesa não pertence ao seu usuário',
    example: {
      message: 'Essa despesa não pertence ao seu usuário',
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
  @Delete(':expenseId')
  delete(@CurrentUser() user: User, @Param('expenseId') expenseId: string) {
    return this.expensesService.delete(user, expenseId);
  }
}
