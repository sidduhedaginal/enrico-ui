import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private matsnackbar: MatSnackBar) {}

  alert(message: any, action?: string, duration?: number) {
    const snack_ref = this.matsnackbar.open(message, action, {
      duration: duration ? duration : 5000,
    });
    snack_ref.onAction().subscribe(() => {
      snack_ref.dismiss();
    });
  }

  alerts(message: any, action?: string, duration?: number) {
    const snack_ref = this.matsnackbar.open(message, action);
    snack_ref.onAction().subscribe(() => {
      snack_ref.dismiss();
    });
  }
}
