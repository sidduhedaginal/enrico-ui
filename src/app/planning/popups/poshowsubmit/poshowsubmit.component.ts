import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-poshowsubmit',
  templateUrl: './poshowsubmit.component.html',
  styleUrls: ['./poshowsubmit.component.css']
})
export class PoshowsubmitComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
  
}
