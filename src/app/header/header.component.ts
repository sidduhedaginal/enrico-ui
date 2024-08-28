import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '@micro-app/auth';
import { Notification } from '../model/notification';
import { HomeService } from '../services/home.service';
import { GuardConfigGuard } from 'src/app/guard-config.guard';
import { AdministratorGuard } from 'src/app/administrator.guard';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  search: string = '';
  isExpanded: boolean = false;
  isOpenProfile: boolean = false;
  isOpenNotification: boolean = false;
  displayName: string | undefined = '';
  notifications: Notification[] = [];
  notificationsList: any = [];
  @Output() toggle = new EventEmitter<boolean>();
  userProfile: any;
  timeInterval: number = 1;
  daysInterval: number = 30;
  initialNumberOfBatch: number = 1;
  isSystemAdmin: boolean = false;
  isEntityAdmin: boolean = false;
  notificationCount: number | string = '';
  isNotificationScrollEndReached:boolean = false;
  isVendor: boolean = false;
  unReadNotification: number = 0;
  constructor(
    private identityService: AuthService,
    private homeService: HomeService,
    private entityAdminGuard: GuardConfigGuard,
    private systemAdminGuard: AdministratorGuard,
    private router: Router,
    private notificationService:NotificationService,
  ) {
    this.isEntityAdmin = this.entityAdminGuard.canActivate(
      null,
      null
    ) as boolean;
    this.isSystemAdmin = this.systemAdminGuard.canActivate(
      null,
      null
    ) as boolean;
  }

  ngAfterViewInit() {
    this.homeService.getNotifications().subscribe((response: any) => {
      this.notifications = response.data;
    });

    this.identityService.getUser().then((user) => {
      this.displayName = user?.profile.name;
    });
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem(environment.localStorageKeyWord));
    const user_roles = data?.profile?.user_roles; 

    if(user_roles && user_roles.includes( "/EnricoUsers")){
      this.isVendor = false;
      this.getNotificationsOnLoad();
    }
    if(user_roles && user_roles.includes("/Vendors")){
      this.isVendor = true; 
      this.getNotificationsForVendorOnLoad();
    }
  }

  formatDate(date: any) {
    let year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    return year + '%2F' + month + '%2F' + day;
  }

  updateTheCount(notifications: any) {
    let count = 0;
    for (const notification of notifications) {
      if (notification.isSeen == false) count++;
    }

    if (count < 10) this.notificationCount = String(count);
    if (count >= 10) this.notificationCount = '9+';
  }

  getDateInThatInterval(interval: number, date: Date) {
    date.setDate(date.getDate() - this.daysInterval * interval);
    return date;
  }

  updateunReadNotification(newValue: number) {
    this.unReadNotification = newValue;
  }

  getNotificationsOnLoad() {
    let fromDate: string = this.formatDate(
        this.getDateInThatInterval(this.timeInterval, new Date())
      ),
      toDate: string = this.formatDate(
        this.getDateInThatInterval(this.timeInterval - 1, new Date())
      );

    this.notificationService.getNotifications(fromDate, toDate).subscribe({
      next: (response: any) => {
        this.unReadNotification = response.data.totalUnread;
        if (this.notificationsList.length == 0) {
          this.notificationsList = response?.data?.notifications;
        } else {
          this.notificationsList = [...this.notificationsList, ...response?.data?.notifications];
        }

        // response.data.length != 0 && 

        if (this.timeInterval < this.initialNumberOfBatch && this.notificationsList.length < 10) {
          this.timeInterval++;
          this.getNotificationsOnLoad();
        } else this.updateTheCount(this.notificationsList);
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {},
    });
  }

  getNotificationsForVendorOnLoad() {
    let fromDate: string = this.formatDate(
        this.getDateInThatInterval(this.timeInterval, new Date())
      ),
      toDate: string = this.formatDate(
        this.getDateInThatInterval(this.timeInterval - 1, new Date())
      );

    this.notificationService.getVendorNotifications(fromDate, toDate).subscribe({
      next: (response: any) => {
        this.unReadNotification = response.data.totalUnread;
        if (this.notificationsList.length == 0) {
          this.notificationsList = response?.data?.notifications;
        } else {
          this.notificationsList = [...this.notificationsList, ...response?.data?.notifications];
        }

        // response.data.length != 0 && 
        if (this.timeInterval < this.initialNumberOfBatch && this.notificationsList.length < 10) {
          this.timeInterval++;
          this.getNotificationsForVendorOnLoad();
        } else this.updateTheCount(this.notificationsList);
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {},
    });
  }


  getNotificationsOnScrollEnd(){
    let fromDate: string = this.formatDate(
      this.getDateInThatInterval(this.timeInterval, new Date())
    ),
    toDate: string = this.formatDate(
      this.getDateInThatInterval(this.timeInterval - 1, new Date())
    );
    
    this.notificationService.getNotifications(fromDate, toDate).subscribe({
      next: (response: any) => {
        if (this.notificationsList.length == 0) {
          this.notificationsList = response?.data?.notifications;
        } else {
          this.notificationsList = [...this.notificationsList, ...response?.data?.notifications];
        }
        this.updateTheCount(this.notificationsList);
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {},
    });

  }
  getNotificationsVendorOnScrollEnd(){
    let fromDate: string = this.formatDate(
      this.getDateInThatInterval(this.timeInterval, new Date())
    ),
    toDate: string = this.formatDate(
      this.getDateInThatInterval(this.timeInterval - 1, new Date())
    );
    this.notificationService.getVendorNotifications(fromDate, toDate).subscribe({
      next: (response: any) => {
        if (this.notificationsList.length == 0) {
          this.notificationsList = response?.data?.notifications;
        } else {
          this.notificationsList = [...this.notificationsList, ...response?.data?.notifications];
        }

        this.updateTheCount(this.notificationsList);
      },
      error: (e: any) => {
        console.log(e);
      },
      complete: () => {},
    });

  }


  clearSearch() {
    this.search = '';
  }
  toggleMenu() {
    this.isExpanded = !this.isExpanded;
    this.toggle.emit(this.isExpanded);
  }

  toggleProfile() {
    this.isOpenProfile = !this.isOpenProfile;
  }

  clickedOutside(): void {
    this.isOpenProfile = false;
  }

  toggleNotifications() {
    this.isOpenNotification = !this.isOpenNotification;
  }

  closeNotification(value: boolean) {
    this.isOpenNotification = value;
  }
  entityAdmin() {
    this.router.navigate(['/Configurations']);
  }
  systemAdmin() {
    this.router.navigate(['./adminConfigurations']);
  }

  logoutUser() {
    // Clear local storage
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    // Clear session storage

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
      const currentURL = window.location.href;
      const urlObject = new URL(currentURL);
      // Extract the base URL (origin)
      const baseURL = urlObject.origin;
      window.location.href = `${environment.keyCloak}/protocol/openid-connect/logout?redirect_uri?=${baseURL}`;
    }
    localStorage.removeItem('filterModelDB');
    localStorage.removeItem('DBChipsKey');
    localStorage.removeItem('filterModelCM');
    localStorage.removeItem('CMChipsKey');
    localStorage.removeItem('filterModelRM');
    localStorage.removeItem('RMChipsKey');
    localStorage.removeItem('FilterColumnSttingsPopupCheckedUncheckedRM');
    localStorage.removeItem('FilterColumnSttingsPopupCheckedUncheckedDB');
    localStorage.removeItem('FilterColumnSttingsPopupCheckedUncheckedCM');
    
  }
  checkScrollEndReached(value :boolean){
    this.isNotificationScrollEndReached = value;
    if(this.isNotificationScrollEndReached == true){
      this.timeInterval++;
      if(this.isVendor == false) this.getNotificationsOnScrollEnd();
      else this.getNotificationsVendorOnScrollEnd();  
    }
  }
}
