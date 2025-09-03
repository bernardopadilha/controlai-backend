import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Comida',
    description: 'Nome da categoria de gasto',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  name: string;

  @ApiProperty({
    example: '🍕',
    description: 'Ícone para identificação',
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo icon é obrigatório' })
  @MinLength(1, { message: 'Insira apenas um ícone ex: 💰' })
  @MaxLength(1, { message: 'Insira apenas um ícone ex: 💰' })
  icon: string;
}
