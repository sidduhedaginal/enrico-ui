import {
  Component,
  EventEmitter,
  Output,
  Input,
  ElementRef,
} from '@angular/core';
import {NotificationService } from '../services/notification.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  @Input() notifications: any;
  @Output() closeModal = new EventEmitter<boolean>();
  @Output() scrollEndReached = new EventEmitter<boolean>();
  @Input() unReadNotification: number;
  @Output() updateunReadNotification: EventEmitter<number> = new EventEmitter();

  scrollBottomBuffer: number = 0;
  isVendor:boolean;
  constructor(
    private elementRef: ElementRef,
    private  notificationService : NotificationService,
  ) { }
  scrollContainer: any
  ngOnInit() { 
    const data = JSON.parse(localStorage.getItem(environment.localStorageKeyWord));
    const user_roles = data?.profile?.user_roles; 

    if(user_roles && user_roles.includes( "/EnricoUsers")){
      this.isVendor = false;
    }
    if(user_roles && user_roles.includes("/Vendors")){
      this.isVendor = true; 
    }

  }
  ngAfterViewInit(): void {
    this.scrollContainer =
      this.elementRef.nativeElement.querySelector('.list-custom');
  }

  closeNotification() {
    this.closeModal.emit(false);
  }

  onScroll(): void {
    const element = this.scrollContainer;
    const atBottom =
      element.scrollHeight - element.scrollTop - this.scrollBottomBuffer <=
      element.clientHeight;
    // console.log("Scroll Height" + element.scrollHeight + ",  Scroll Top " + element.scrollTop + ",ClientHeight" + element.clientHeight);

    if (atBottom) {
      this.scrollEndReached.emit(true);
    } else {
      this.scrollEndReached.emit(false);
    }
  }

  notificationSeen(notification: any) {
    const data = {
      notificationId: notification.notificationId,
      isSeen: true,
    };
    
    if (this.isVendor) {
      this.notificationService.updateVendorNotification(data).subscribe({
        next: (response: any) => {
          this.updateunReadNotification.emit(response?.data?.totalUnread);
          this.updateNotificationList(notification.notificationId);
          // if (response.status == 'success') {
          //   // this.updateunReadNotification.emit(newValue);
          //   this.updateNotificationList(notification.notificationId);
          // }
        },
        error: (err: any) => { },
        complete: () => { },
      });
    } else {
      this.notificationService.updateNotification(data).subscribe({
        next: (response: any) => {
          this.updateunReadNotification.emit(response?.data?.totalUnread);
          this.updateNotificationList(notification.notificationId);
          // if (response.status == 'success') {
          //    // this.updateunReadNotification.emit(newValue);
          //   this.updateNotificationList(notification.notificationId);
          // }
        },
        error: (err: any) => { },
        complete: () => { },
      });
    }
  }

  updateNotificationList(notificationId: any) {
    this.notifications.forEach((item: any) => {
      if (item.notificationId == notificationId) {
        item.isSeen = true;
      }
    });
  }
}
