import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatIconModule } from '@angular/material/icon';
import { SearchBarLocationPlantComponent } from './search-bar-location-plant.component';

@NgModule({
  declarations: [SearchBarLocationPlantComponent],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [SearchBarLocationPlantComponent],
})
export class SearchBarLocationPlantModule {}
