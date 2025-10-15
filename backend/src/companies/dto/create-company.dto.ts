import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsCnpj } from 'src/common/validators/is-cnpj.validator';
import { Transform } from 'class-transformer';
import { cnpj } from 'cpf-cnpj-validator';
export class CreateCompanyDto {
  @ApiProperty({ example: 'Forte Tecnologias' })
  @IsString({
    message: 'O nome deve ser composto apenas por letras e espaços.',
  })
  @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres.' })
  name: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @IsCnpj({ message: 'Formato de CNPJ inválido' })
  @IsString()
  @Transform(({ value }) => cnpj.format(value))
  cnpj: string;
}
