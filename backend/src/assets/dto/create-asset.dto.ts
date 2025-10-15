import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, MinLength } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'Dell XPS 15' })
  @IsString()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres.' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  typeId: number;
}
