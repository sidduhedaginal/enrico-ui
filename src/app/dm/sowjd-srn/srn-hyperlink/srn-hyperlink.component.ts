import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';

@Component({
  selector: 'app-srn-hyperlink',
  templateUrl: './srn-hyperlink.component.html',
  styleUrls: ['./srn-hyperlink.component.scss']
})
export class SrnHyperlinkComponent {
  userDetails: userProfileDetails;
  roleList = [];

  constructor(private router: Router) {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('user_profile_details')
    );
    if (this.userDetails.roleDetail.length > 0) {
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );
    }
  }

  data: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.data = params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  navigateToSRNDetail(srnId: string) {
    this.router.navigate(['/sowjd-srn/', srnId]);
  }

}
