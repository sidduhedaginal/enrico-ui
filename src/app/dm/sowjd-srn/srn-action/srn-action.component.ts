import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { sowjdService } from '../../services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-srn-action',
  templateUrl: './srn-action.component.html',
  styleUrls: ['./srn-action.component.scss'],
})
export class SrnActionComponent {
  permissionDetails: PermissionDetails;
  subscription: Subscription;

  constructor(private sowjdservice: sowjdService) {
    // Using for Roles and Permissions
    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });
  }

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  doApprove() {
    this.params.doApprove(this.params);
  }
  doSendBack() {
    this.params.doSendBack(this.params);
  }
  doWithdraw() {
    this.params.doWithdraw(this.params);
  }
  doDelegate() {
    this.params.doDelegate(this.params);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
