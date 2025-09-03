import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Comida',
    description: 'Nome da categoria de gasto',
  })
  @IsString()
  name?: string;

  @ApiProperty({
    example: '🍕',
    description: 'Ícone para identificação',
  })
  @IsString()
  @MinLength(1, { message: 'Insira apenas um ícone ex: 💰' })
  @MaxLength(1, { message: 'Insira apenas um ícone ex: 💰' })
  icon?: string;
}
