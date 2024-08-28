import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarVendorComponent } from './search-bar-vendor.component';

@NgModule({
  declarations: [SearchBarVendorComponent],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [SearchBarVendorComponent],
})
export class SearchBarVendorModule {}
