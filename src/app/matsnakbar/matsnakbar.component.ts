import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-matsnakbar',
  templateUrl: './matsnakbar.component.html',
  styleUrls: ['./matsnakbar.component.scss'],
})
export class MatsnakbarComponent {
  durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, className: string) {
    this._snackBar.open(message, action, {
      // duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [className],
    });
  }
}
