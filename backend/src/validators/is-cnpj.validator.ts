import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cnpj } from 'cpf-cnpj-validator';

@ValidatorConstraint({ async: false })
export class IsCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return typeof value === 'string' && cnpj.isValid(value);
  }

  defaultMessage() {
    return 'Invalid CNPJ format';
  }
}

export function IsCnpj(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCnpjConstraint,
    });
  };
}
