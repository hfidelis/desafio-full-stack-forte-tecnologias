import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { IsCnpj } from 'src/common/validators/is-cnpj.validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Forte Tecnologias' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @IsCnpj({ message: 'Formato de CNPJ inválido' })
  @IsString()
  cnpj: string;
}
