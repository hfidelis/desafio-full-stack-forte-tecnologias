import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { UpdateEmployeeDto } from '../../../interfaces/employee.interfaces';
import { CompaniesService } from '../../../core/services/company.service';
import { Company } from '../../../interfaces/company.interfaces';
import { validateCPF } from '../../../shared/validators/cpf.validator';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.scss'],
})
export class EmployeeDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateEmployeeDto | null
  ) {
    const employeeData = data || {};
    this.form = this.fb.group({
      name: [employeeData.name || '', Validators.required],
      email: [employeeData.email || '', [Validators.required, Validators.email]],
      cpf: [employeeData.cpf || '', [Validators.required, validateCPF]],
    });
  }

  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
