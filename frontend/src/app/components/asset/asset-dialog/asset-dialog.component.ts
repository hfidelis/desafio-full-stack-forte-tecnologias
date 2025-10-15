import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { AssetsService } from '../../../core/services/assets.service';
import { UpdateAssetDto, AssetParentDto } from '../../../interfaces/assets.interfaces';
import { TranslateAssetPipe } from '../../../shared/pipes/translate-asset.pipe';

@Component({
  selector: 'app-asset-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    TranslateAssetPipe,
  ],
  templateUrl: 'asset-dialog.component.html',
  styleUrls: ['asset-dialog.component.scss']
})
export class AssetDialogComponent implements OnInit {
  form: FormGroup;
  types: AssetParentDto[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetDialogComponent>,
    private assetsService: AssetsService,
    @Inject(MAT_DIALOG_DATA) public data: UpdateAssetDto | null
  ) {
    const assetData = data || {};
    this.form = this.fb.group({
      name: [assetData.name || '', Validators.required],
      typeId: [assetData.typeId || null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadTypes();
  }

  loadTypes() {
    this.assetsService.getAssetTypes().subscribe((res) => (this.types = res));
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
