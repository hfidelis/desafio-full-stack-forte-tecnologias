import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsInt } from 'class-validator';
import { IsCpf } from '../../common/validators/is-cpf.validator';
import { cpf } from 'cpf-cnpj-validator';
import { Transform } from 'class-transformer';
export class CreateEmployeeDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString({
    message: 'O nome deve ser composto apenas por letras e espaços.',
  })
  @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres.' })
  name: string;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @IsCpf({ message: 'Formato de CPF inválido' })
  @Transform(({ value }) => cpf.format(value))
  cpf: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  companyId: number;
}
