import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: '20000 (in cents)',
    description: 'Valor da despesa em centavos',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'O campo amount é obrigatório' })
  amount: number; // in cents

  @ApiProperty({
    example: 'Aluguel',
    description: 'Descrição do gasto',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo description é obrigatório' })
  description: string;

  @ApiProperty({
    example: '2025-08-28T03:00:00.000Z',
    description: 'Data que a despesa foi feita',
  })
  @IsDate()
  @IsNotEmpty({ message: 'O campo date é obrigatório' })
  date: Date;

  @ApiProperty({
    example: 'e84e35ba-b872-487a-8ac1-471e4605493d',
    description: 'Exemplo de id de uma despesa',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo categoryId é obrigatório' })
  categoryId: string;
}
