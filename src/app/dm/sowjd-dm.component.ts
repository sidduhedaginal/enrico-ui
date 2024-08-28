import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionDetails } from '../common/user-profile/user-profile';
import { sowjdService } from './services/sowjdService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sowjd-dm',
  templateUrl: './sowjd-dm.component.html',
  styleUrls: ['./sowjd-dm.component.css'],
})
export class SowjdDmComponent {
  url: string;
  permissionDetailsSoWJD: PermissionDetails;
  permissionDetailsRFQ: PermissionDetails;
  permissionDetailsSignOff: PermissionDetails;
  subscription: Subscription;

  constructor(private router: Router, private sowjdService: sowjdService) {
    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();

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
    });
  }

  ngOnInit(): void {}
}
