import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateCPF(control: AbstractControl): ValidationErrors | null {
  const raw = control.value || '';
  const cpf = raw.replace(/\D/g, '');

  if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return { invalidCPF: true };
  }

  const calcCheckDigit = (base: string, factor: number) => {
    let sum = 0;
    for (const digit of base) {
      sum += Number(digit) * factor--;
      if (factor < 2) factor = 9;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstCheck = calcCheckDigit(cpf.slice(0, 9), 10);
  const secondCheck = calcCheckDigit(cpf.slice(0, 9) + firstCheck, 11);

  return cpf.endsWith(`${firstCheck}${secondCheck}`) ? null : { invalidCPF: true };
}
