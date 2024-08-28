import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaningService } from '../services/planing.service';
import { HomeService } from 'src/app/services/home.service';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-planningtabs',
  templateUrl: './planningtabs.component.html',
  styleUrls: ['./planningtabs.component.css']
})
export class PlanningtabsComponent {
  selectedTab= 0;
  public currenttabindex : any;
  @Output() TabChangeApply = new  EventEmitter<any>();
  showCFCycle : boolean = false;
  showAOP : boolean = false;
  showFirstLevel : boolean = false;
  showSecondLevel : boolean = false;
  showPO : boolean = false;
  userProfile: UserProfile | any;
  featureDetails : any ; 

  userProfileDetails : userProfileDetails | any ;
  constructor(
    private planningService: PlaningService,
    private homeService: HomeService,
    private router: Router,
    private loaderService: LoaderService,
    ){
      this.checkUserProfileValueValid();
  }



  ngOnInit(){
    this.currenttabindex = localStorage.getItem('transactionTabIndex');
  }
  tabClick(event:any){
    this.selectedTab = event.index;
    if(event.tab.isActive){
      this.currenttabindex = event.index;
      localStorage.setItem('transactionTabIndex', this.currenttabindex.toString());
    }
    
    this.TabChangeApply.emit(event);
    this.planningService.updateTabIndex(event.index);
  }

  getProfileRoles() {
     this.loaderService.setShowLoading();
   this.homeService.getProfileRoles()
   .subscribe({
     next: (response:any) => {
       this.userProfileDetails = response.data;
       this.planningService.profileDetails = response.data;
       StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
       const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning"));
       if(masterDataModules.length != 0){
        const masterDataFeatureDetails = masterDataModules.map((item:any) => {
          const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
          return masterDataModule.featureDetails;
        });
        this.featureDetails = masterDataFeatureDetails;
        for(let plan of this.featureDetails){
          for(let item of plan){
            if(item.featureCode.startsWith("CFCyclePlanning")){
              item.id = "0";
              this.showCFCycle = true;
            }else if(item.featureCode.startsWith("AOPPlanning")){
              item.id = "1";
              this.showAOP = true;
            } else if(item.featureCode.startsWith("FirstLevelPlanning")){
              item.id = "2";
              this.showFirstLevel = true;
            } else if(item.featureCode.startsWith("SecondLevelPlanning")){
              item.id = "3";
              this.showSecondLevel = true;
            } else if(item.featureCode.startsWith("PODetails")){
              item.id = "4";
              this.showPO = true;
            } 
          }  
          let sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
          plan = sorttest2;     
        }
        this.loaderService.setDisableLoading();
      }else {
        this.loaderService.setDisableLoading();
        this.router.navigate(['planning/access-denied']);     
      }
       

     },
     error: (e:any) => {
       this.loaderService.setDisableLoading();
     },
     complete: () => {
       this.loaderService.setDisableLoading();
     }
 });
 }
  checkUserProfileValueValid(){
    this.loaderService.setShowLoading();
    this.planningService.profileDetails = StorageQuery.getUserProfile();
    if(this.planningService.profileDetails == '' || this.planningService.profileDetails == undefined) {
      this.getProfileRoles();
    }
    else {
      this.userProfileDetails = this.planningService.profileDetails;
      const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning")); 
      if(masterDataModules.length != 0){
        const masterDataFeatureDetails = masterDataModules.map((item:any) => {
          const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
          return masterDataModule.featureDetails;
        });
        this.featureDetails = masterDataFeatureDetails;
        for(let plan of this.featureDetails){
          for(let item of plan){
            if(item.featureCode.startsWith("CFCyclePlanning")){
              item.id = "0";
              this.showCFCycle = true;
            }else if(item.featureCode.startsWith("AOPPlanning")){
              item.id = "1";
              this.showAOP = true;
            } else if(item.featureCode.startsWith("FirstLevelPlanning")){
              item.id = "2";
              this.showFirstLevel = true;
            } else if(item.featureCode.startsWith("SecondLevelPlanning")){
              item.id = "3";
              this.showSecondLevel = true;
            } else if(item.featureCode.startsWith("PODetails")){
              item.id = "4";
              this.showPO = true;
            } 
          }  
          let sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
          plan = sorttest2;  
        }
        this.loaderService.setDisableLoading();
      }else {
        this.loaderService.setDisableLoading();
        this.router.navigate(['planning/access-denied']);     
      }
  
    }

    
   }

}
