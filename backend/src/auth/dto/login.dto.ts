import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  email: string;

  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
