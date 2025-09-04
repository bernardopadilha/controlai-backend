import { BadRequestException, Injectable } from '@nestjs/common';
import { getDaysInMonth } from 'date-fns';
import { PrismaService } from '../prisma/prisma.service';
import type { User } from '../types/user.type';
import type { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(user: User, createExpenseDto: CreateExpenseDto) {
    const { date, amount, categoryId, description } = createExpenseDto;
    const expenseDate = new Date(date);

    const categoryRow = await this.prisma.category.findFirst({
      where: {
        userId: user.id,
        id: categoryId,
      },
    });
    if (!categoryRow) {
      throw new Error('category not found');
    }

    const expense = await this.prisma.$transaction([
      this.prisma.expense.create({
        data: {
          date: expenseDate,
          amount,
          categoryId,
          description,
          userId: user.id,
        },
      }),

      // Update month aggregate table
      this.prisma.monthHistory.upsert({
        where: {
          day_month_year_userId: {
            userId: user.id,
            day: expenseDate.getUTCDate(),
            month: expenseDate.getUTCMonth() + 1,
            year: expenseDate.getUTCFullYear(),
          },
        },
        create: {
          userId: user.id,
          day: expenseDate.getUTCDate(),
          month: expenseDate.getUTCMonth() + 1,
          year: expenseDate.getUTCFullYear(),
          expense: amount,
        },
        update: {
          expense: {
            increment: amount,
          },
        },
      }),

      // Update year aggregate table
      this.prisma.yearHistory.upsert({
        where: {
          month_year_userId: {
            userId: user.id,
            month: expenseDate.getUTCMonth() + 1,
            year: expenseDate.getUTCFullYear(),
          },
        },
        create: {
          userId: user.id,
          month: expenseDate.getUTCMonth() + 1,
          year: expenseDate.getUTCFullYear(),
          expense: amount,
        },
        update: {
          expense: {
            increment: amount,
          },
        },
      }),
    ]);

    return expense[0];
  }

  async getTotalExpenses(user: User, from: Date, to: Date) {
    const totalExpenses = await this.prisma.expense.aggregate({
      where: {
        userId: user.id,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return totalExpenses;
  }

  async getExpensesPerCategories(user: User, from: Date, to: Date) {
    const expensesPerCategories = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        userId: user.id,
        date: {
          gte: from,
          lte: to,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    const categoryIds = expensesPerCategories.map((e) => e.categoryId);

    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    return expensesPerCategories.map((e) => {
      const category = categories.find((c) => c.id === e.categoryId);
      return {
        category: category?.name,
        categoryIcon: category?.icon,
        type: 'expense',
        _sum: e._sum,
      };
    });
  }

  async findAllExpensesByUserId(user: User, from: Date, to: Date) {
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return expenses;
  }

  async delete(user: User, expenseId: string) {
    const expense = await this.prisma.expense.findUnique({
      where: {
        id: expenseId,
        userId: user.id,
      },
    });

    if (!expense) {
      throw new BadRequestException('Essa despesa não pertence ao seu usuário');
    }

    await this.prisma.$transaction([
      this.prisma.expense.delete({
        where: {
          id: expenseId,
          userId: user.id,
        },
      }),

      this.prisma.monthHistory.update({
        where: {
          day_month_year_userId: {
            userId: user.id,
            day: expense.date.getUTCDate(),
            month: expense.date.getUTCMonth() + 1,
            year: expense.date.getUTCFullYear(),
          },
        },
        data: {
          expense: {
            decrement: expense.amount,
          },
        },
      }),

      this.prisma.yearHistory.update({
        where: {
          month_year_userId: {
            userId: user.id,
            month: expense.date.getUTCMonth() + 1,
            year: expense.date.getUTCFullYear(),
          },
        },
        data: {
          expense: {
            decrement: expense.amount,
          },
        },
      }),
    ]);
  }

  async getHistoryData(
    user: User,
    year: number,
    timeframe: 'month' | 'year',
    month: number,
  ) {
    const data = await getHistoryData({
      prisma: this.prisma,
      userId: user.id,
      timeframe,
      month,
      year,
    });

    return data;
  }
}

async function getHistoryData({
  month,
  prisma,
  timeframe,
  userId,
  year,
}: {
  prisma: PrismaService;
  userId: string;
  timeframe: 'month' | 'year';
  year: number;
  month: number;
}) {
  switch (timeframe) {
    case 'year':
      return await getYearHistoryData({
        prisma,
        year,
        userId,
      });
    case 'month':
      return await getMonthHistoryData({
        prisma,
        userId,
        year,
        month,
      });
  }
}

type HistoryData = {
  expense: number;
  year: number;
  month: number;
  day?: number;
};

async function getYearHistoryData({
  year,
  prisma,
  userId,
}: {
  prisma: PrismaService;
  userId: string;
  year: number;
}) {
  const result = await prisma.yearHistory.groupBy({
    by: ['month'],
    where: {
      userId,
      year,
    },
    _sum: {
      expense: true,
    },
    orderBy: [
      {
        month: 'asc',
      },
    ],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  for (let i = 1; i < 13; i++) {
    let expense = 0;

    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
    }

    history.push({
      year,
      month: i,
      expense,
    });
  }

  return history;
}

async function getMonthHistoryData({
  year,
  month,
  prisma,
  userId,
}: {
  prisma: PrismaService;
  userId: string;
  month: number;
  year: number;
}) {
  const result = await prisma.monthHistory.groupBy({
    by: ['day'],
    where: {
      userId,
      year,
      month,
    },
    _sum: {
      expense: true,
    },
    orderBy: {
      day: 'asc',
    },
  });

  console.log('@@MONTH', month);

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];
  const daysInMonth = getDaysInMonth(new Date(year, month));

  for (let i = 1; i <= daysInMonth; i++) {
    let expense = 0;

    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
    }

    history.push({
      expense,
      month,
      year,
      day: i,
    });
  }

  return history;
}
