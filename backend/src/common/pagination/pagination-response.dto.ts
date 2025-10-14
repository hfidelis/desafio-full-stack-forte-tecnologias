import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  page_size: number;

  @ApiProperty({ example: 100 })
  count: number;

  @ApiProperty({ isArray: true })
  results: T[];
}
