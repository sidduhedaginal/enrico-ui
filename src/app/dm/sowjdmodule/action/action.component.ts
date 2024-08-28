import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import {
  PermissionDetails,
  userProfileDetails,
} from 'src/app/common/user-profile/user-profile';
import { sowjdService } from '../../services/sowjdService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  userDetails: userProfileDetails;
  roleList = [];
  bgswSpocRole: boolean;
  permissionDetailsSoWJD: PermissionDetails;
  permissionDetailsRFQ: PermissionDetails;
  permissionDetailsSignOff: PermissionDetails;
  subscription: Subscription;

  constructor(public sowjdservice: sowjdService) {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('user_profile_details')
    );
    if (this.userDetails.roleDetail.length > 0) {
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );
    }

    // Using for Roles and Permissions
    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSoWJD = roles;
      });

    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailRFQ()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsRFQ = roles;
      });

    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSignOff()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSignOff = roles;
      });

    this.bgswSpocRole = this.sowjdservice.bgswSpocRole;
  }

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  openWidthdrawDialog() {
    this.params.openWidthdrawDialog(this.params);
  }
  doClone() {
    this.params.doClone(this.params);
  }
  doSubmit() {
    this.params.doSubmit(this.params);
  }
  doDelete() {
    this.params.doDelete(this.params);
  }
  doDHApproveReject() {
    this.params.doDHApproveReject(this.params);
  }
  doSPOCApproveReject() {
    this.params.doSPOCApproveReject(this.params);
  }
  doFloatRFQ() {
    this.params.doFloatRFQ(this.params);
  }
  doInitiateSignOff() {
    this.params.doInitiateSignOff(this.params);
  }
}
