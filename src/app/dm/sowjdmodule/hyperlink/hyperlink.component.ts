import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import {
  PermissionDetails,
  userProfileDetails,
} from 'src/app/common/user-profile/user-profile';
import { sowjdService } from '../../services/sowjdService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.scss'],
})
export class HyperlinkComponent {
  userDetails: userProfileDetails;
  roleList = [];
  permissionDetails: PermissionDetails;
  subscription: Subscription;

  constructor(private router: Router, public sowjdservice: sowjdService) {
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
        this.permissionDetails = roles;
      });
  }

  data: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.data = params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  navigateToSowjdDetail(sowjdId: string) {
    localStorage.setItem('sowjdId', sowjdId);
    this.router.navigate(['/my-sowjd/sowjd-detail']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
