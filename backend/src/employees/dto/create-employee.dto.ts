import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsInt } from 'class-validator';
import { IsCpf } from '../../common/validators/is-cpf.validator';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @IsCpf({ message: 'Formato de CPF inválido' })
  cpf: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  companyId: number;
}
