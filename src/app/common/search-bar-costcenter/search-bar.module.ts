import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarCostcenterComponent } from './search-bar-costcenter.component';

@NgModule({
  declarations: [SearchBarCostcenterComponent],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [SearchBarCostcenterComponent],
})
export class CostcenterSearchBarModule {}
