import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AddVendorComponent } from './add-vendor.component';
import { MaterialModule } from 'src/app/material/material.module';

@NgModule({
  declarations: [AddVendorComponent],
  imports: [CommonModule, MaterialModule],
  exports: [AddVendorComponent],
})
export class AddVendorModule {}
