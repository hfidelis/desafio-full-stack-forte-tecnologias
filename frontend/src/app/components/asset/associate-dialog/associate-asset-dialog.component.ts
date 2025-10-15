import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asset } from '../../../interfaces/assets.interfaces';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateAssetPipe } from '../../../shared/pipes/translate-asset.pipe';

@Component({
  selector: 'associate-assets-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatRadioModule, TranslateAssetPipe],
  styleUrls: ['./associate-asset-dialog.component.scss'],
  template: `
    <h2>Associar Ativo</h2>
    <form [formGroup]="form" class="dialog-form">
      <mat-radio-group formControlName="selectedAsset">
        <mat-radio-button *ngFor="let asset of availableAssets" [value]="asset">
          Nome: {{ asset.name }} - Tipo: {{ asset.type.name | translateAsset: 'type' }}
        </mat-radio-button>
      </mat-radio-group>
    </form>

    <div class="dialog-actions">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-button color="primary" [disabled]="!form.value.selectedAsset" (click)="associate()">Associar</button>
    </div>
  `,
})
export class AssociateAssetsDialog {
  availableAssets: Asset[] = [];
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssociateAssetsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { availableAssets: Asset[] }
  ) {
    this.availableAssets = data.availableAssets;
    this.form = this.fb.group({
      selectedAsset: [null],
    });
  }

  associate() {
    const selectedAsset: Asset = this.form.value.selectedAsset;
    if (selectedAsset) {
      this.dialogRef.close([selectedAsset]);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
