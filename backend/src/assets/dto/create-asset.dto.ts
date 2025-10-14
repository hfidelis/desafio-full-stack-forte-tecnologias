import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'Dell XPS 15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  typeId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  statusId: number;
}
