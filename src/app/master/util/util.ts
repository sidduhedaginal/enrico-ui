import { MatDialog } from '@angular/material/dialog';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';

export class OpenFormDilog {
  constructor(private dialog: MatDialog) {}
  openFormModal(
    selectedMaster: string,
    menuId: number,
    uiJson: any,
    component = 'dynamic',
    payload: any = {},
    operation = 'create',
    method: any
  ) {
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '70%',
      data: {
        selectedMaster,
        menuId,
        uiJson,
        component,
        payload,
        operation,
        method,
      },
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          method();
        }
      }
    );
  }
}
