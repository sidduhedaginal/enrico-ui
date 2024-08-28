import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { StorageQuery } from '../common/storage-service/storage-service';
import {
  PermissionDetails,
  userProfileDetails,
} from '../common/user-profile/user-profile';
import { environment } from '../../environments/environment';
import { sowjdService } from '../dm/services/sowjdService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  isExpanded: boolean = false;
  isOpenProfile: boolean = false;
  roleList = [];
  userProfileDetails: userProfileDetails;
  vendorDetails: any;
  permissionDetailsSoWJD: PermissionDetails;
  permissionDetailsRFQ: PermissionDetails;
  permissionDetailsSignOff: PermissionDetails;
  permissionDetailsSRN: PermissionDetails;
  subscription: Subscription;

  constructor(
    private homeService: HomeService,
    private sowjdService: sowjdService
  ) {
    // Using for Roles and Permissions
    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSoWJD = roles;
      });

    this.subscription = this.sowjdService
      .getUserProfileRoleDetailRFQ()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsRFQ = roles;
      });

    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSignOff()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSignOff = roles;
      });

    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSRN()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSRN = roles;
      });
  }
  isVendor: boolean = false;

  ngAfterViewInit() {
    const data = JSON.parse(
      localStorage.getItem(environment.localStorageKeyWord)
    );
    const user_roles = data?.profile?.user_roles;

    if (user_roles && user_roles.includes('/EnricoUsers')) {
      this.isVendor = false;
      localStorage.setItem('isVendor', JSON.stringify(this.isVendor));
      this.getProfileRoles();
    } else if (user_roles && user_roles.includes('/Vendors')) {
      this.isVendor = true;
      localStorage.setItem('isVendor', JSON.stringify(this.isVendor));
      this.getVendorProfile();
    }
  }

  getVendorProfile() {
    // this.showLoading = true;
    this.homeService.getVendorProfile().subscribe({
      next: (response: any) => {
        StorageQuery.setUserProfile(JSON.stringify(response.data));
        this.vendorDetails = response.data;
      },
      error: (e: any) => {
        // this.showLoading = false;
        console.log(e);
      },
      complete: () => {
        // this.showLoading = false;
      },
    });
  }

  getProfileRoles() {
    this.homeService.getProfileRoles().subscribe((response: any) => {
      this.userProfileDetails = response.data;
      if (
        this.userProfileDetails.roleDetail &&
        this.userProfileDetails.roleDetail.length > 0
      ) {
        this.roleList = response.data.roleDetail[0].roleDetails.map(
          (item: any) => item.roleName
        );
      }
      StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
    });
  }

  checkToggle(value: boolean) {
    this.isExpanded = value;
  }

  toggleProfile() {
    this.isOpenProfile = !this.isOpenProfile;
  }

  clickedOutside(): void {
    this.isOpenProfile = false;
  }
}
