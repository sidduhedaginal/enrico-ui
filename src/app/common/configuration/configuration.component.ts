import { Component, OnInit } from '@angular/core';
import { CommonApiServiceService } from '../common-api-service.service';
// import {EmailSettingsComponent} from './configurationDetails/email-settings/email-settings.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  selectedTab = 0;
  constructor(private commonApiService: CommonApiServiceService) {}
  ngOnInit(): void {
    // this.getDocument();
    // for(let i = 0; i < 10; i++){
    //   this.postNotificationsVendor(i);
    // }
    // this.getTestApi('notifications?FromDate=2023%2F09%2F20&ToDate=2023%2F09%2F26');
    
  }
  tabChanged(event: any) {
    this.selectedTab = event.index;
  }

  // postNotifications(index: number) {
  //   this.commonApiService.postNotifications(index).subscribe({
  //     next: (response: any) => {},
  //     error: (e: any) => {
  //       console.log(e);
  //     },
  //     complete: () => {},
  //   });
  // }

  // getDocument(){
  //   this.commonApiService.getDocument(
  //     "9f869db4-5432-464f-b8be-ff55b531b9eb", // moduleId
  //     "b2744d09-925a-4661-9086-01bc2c527c05", // feature
  //     1, // sortDirection
  //     0, // pageIndex
  //     10 // pageSize
  //   ).subscribe({
  //     next:(response:any) =>{
  //       console.log(response);
  //     },
  //     error: (error:any) => {
  //       console.log(error);
  //     },
  //     complete: () => {}
  //   })
  // }


  // postNotificationsVendor(index:number){
  //   this.commonApiService.postNotificationsVendor(index).subscribe({
  //     next:(response:any) =>{},
  //     error: (e:any) =>{
  //       console.log(e);
  //     },
  //     complete:() => {}
  //   })
  // }
  
  getTestApi(endPoint: string) {
    // this.showLoading = true;
    this.commonApiService.testApi(endPoint).subscribe({
      next: (response: any) => {},
      error: (e: any) => {
        // this.showLoading = false;
        console.log(e);
      },
      complete: () => {
        // this.showLoading = false;
      },
    });
  }
}
