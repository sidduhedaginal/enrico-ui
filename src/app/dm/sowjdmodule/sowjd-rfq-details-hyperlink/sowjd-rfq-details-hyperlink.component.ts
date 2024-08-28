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
  selector: 'app-sowjd-rfq-details-hyperlink',
  templateUrl: './sowjd-rfq-details-hyperlink.component.html',
  styleUrls: ['./sowjd-rfq-details-hyperlink.component.scss'],
})
export class SowjdRfqDetailsHyperlinkComponent {
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

  navigateToSowjdRfqDetail(rfqId: string, sowjdId: string) {
    localStorage.setItem('sowjdId', sowjdId);
    this.router.navigate(['/sowjd/rfq-tech-eval', rfqId]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
