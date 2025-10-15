import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateCNPJ(control: AbstractControl): ValidationErrors | null {
  const raw = control.value || '';
  const cnpj = raw.replace(/\D/g, '');

  if (!cnpj || cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) {
    return { invalidCNPJ: true };
  }

  const calcCheckDigit = (base: string, factor: number): number => {
    let sum = 0;
    for (const digit of base) {
      sum += Number(digit) * factor--;
      if (factor < 2) factor = 9;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const base = cnpj.slice(0, 12);
  const firstCheck = calcCheckDigit(base, 5);
  const secondCheck = calcCheckDigit(base + firstCheck, 6);

  const isValid = cnpj.endsWith(`${firstCheck}${secondCheck}`);
  return isValid ? null : { invalidCNPJ: true };
}
