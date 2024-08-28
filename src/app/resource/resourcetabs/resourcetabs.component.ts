import { Component, VERSION, AfterViewInit, ViewChild,HostListener } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { InitiateDeBoardingDialogComponent } from '../initiate-de-boarding-dialog/initiate-de-boarding-dialog.component';
import { Location } from '@angular/common';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { FormControl } from '@angular/forms';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';

import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
@Component({
  selector: 'app-resourcetabs',
  templateUrl: './resourcetabs.component.html',
  styleUrls: ['./resourcetabs.component.css']
})
export class ResourcetabsComponent {
   
  isShowResourceMasterTable: boolean = false;
  isShowDeBordingTable: boolean = false;
  isShowChangeRequestTable: boolean = false;
  searchValueInput: any = '';
  ddlResource:any='resourceMaster';
  setDDlValue:any='';

  selected = new FormControl(2); 
  _checkuser: any = [];
  userDetailsRoles:any=[];

  subscription: Subscription;
  permissionsBehaviorSubjectResourcePlanOpenOrder: PermissionDetails;
  subscriptionOB: Subscription;
  permissionsBehaviorSubjectOnboarding: PermissionDetails;
  subscriptionRM: Subscription;
  permissionsBehaviorSubjectResourceMaster: PermissionDetails;

  subscriptionDB: Subscription;
  permissionsBehaviorSubjectDeboarding: PermissionDetails;

  subscriptionCM: Subscription;
  permissionsBehaviorSubjectChangeManagement: PermissionDetails;
loadVaiable:boolean=false;
  constructor(public dialog: MatDialog,private location:Location,private router:Router,private route:ActivatedRoute,private API:ApiResourceService,private sowjdService: sowjdService) {
    this.subscription = this.sowjdService.getUserProfileRoleDetailResourcePlanOpenOrder().subscribe((roles: PermissionDetails) => {
       this.permissionsBehaviorSubjectResourcePlanOpenOrder = roles;
      });
      this.subscriptionOB = this.sowjdService.getUserProfileRoleDetailOnboarding().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectOnboarding = roles;
      });
      this.subscriptionRM = this.sowjdService.getUserProfileRoleDetailResourceMaster().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectResourceMaster = roles;
      });
      this.subscriptionDB = this.sowjdService.getUserProfileRoleDetailDeboarding().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectDeboarding = roles;
      });
      this.subscriptionCM = this.sowjdService.getUserProfileRoleDetailChangeManagement().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectChangeManagement = roles;
      });
  }
  ngOnInit() {
    this.getRolePermission();
    this._checkuser = StorageQuery.getUserProfile();
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
   let _urlIdName= this.route.snapshot.queryParams.data;
   if(_urlIdName==undefined){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "data"   : encodeURIComponent('resourceMaster'),
      }
  };
  
  this.router.navigate(["Resource-Management"], navigationExtras);

   }
    if(_urlIdName=='de-boarding'){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource=_urlIdName;
     this.changeResourceManagement(_urlIdName);
    }
    else  if(_urlIdName=='changeManagement'){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource=_urlIdName;
     this.changeResourceManagement(_urlIdName);
    }
    else if(_urlIdName=='resourceMaster'){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource=_urlIdName;
     this.changeResourceManagement(_urlIdName);
    }
    else if(_urlIdName=='resourcePlan'){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource=_urlIdName;
     this.changeResourceManagement(_urlIdName);
    }
    else if(_urlIdName=='onboarding'){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource=_urlIdName;
     this.changeResourceManagement(_urlIdName);
    }
    if(_urlIdName==undefined){
      localStorage.removeItem('dispalyResoucemasterValue');
      this.ddlResource='resourceMaster';
     this.changeResourceManagement('resourceMaster');
    }
   if(this.userDetailsRoles == '/Vendors' && this._checkuser?.businessSupport =='BGV'){
    localStorage.removeItem('dispalyResoucemasterValue');
   this.changeResourceManagement('onboarding');
   }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.searchValueInput = filterValue;
  }
  changeResourceManagement1(event: MatTabChangeEvent){
    const tabName = event.tab.textLabel;
    let val="";
    if(tabName=='Resource Plan (Open Order)'){
      val = 'resourcePlan'
    }
    else if(tabName=='Onboarding'){
      val = 'onboarding'
    }
    else if(tabName=='Resource Master'){
      val = 'resourceMaster'
    }
    else if(tabName=='De-boarding'){
      val = 'de-boarding'
    }
    else if(tabName=='Change Management'){
      val = 'changeManagement'
    }
   this.changeResourceManagement(val);
  }
  showHideRM:boolean=false;
  showHideDB:boolean=false;
  showHideCM:boolean=false;
  showHideOB:boolean=false;
  showHideRP:boolean=false;
  changeResourceManagement(val: any) {
    this.showHideRM=false;
    this.showHideDB=false;
    this.showHideCM=false;
    this.showHideOB=false;
    this.showHideRP=false;


    let popup : HTMLElement | null= document.getElementById('myPopup');
    if( popup != null){
    popup.classList.remove('show');
    }
    this.isShowResourceMasterTable = false;
    this.isShowDeBordingTable = false;
    this.isShowChangeRequestTable = false;
    this.setDDlValue=val;
    localStorage.removeItem('dispalyResoucemasterValue');
    localStorage.setItem('dispalyResoucemasterValue',val);
    let sendTextRootPath="Resource-Management";
    if (val == 'resourceMaster') {
      this.isShowResourceMasterTable = true;
      this.selected = new FormControl(2);
      this.showHideRM=true;
    } else if (val == 'de-boarding') {
      this.isShowDeBordingTable = true;
      this.selected = new FormControl(3);
      this.showHideDB=true;
    }else if (val == 'changeManagement') {
      this.isShowChangeRequestTable = true;
      this.selected = new FormControl(4);
      this.showHideCM=true;
    }
    else if (val == 'onboarding') {
      this.selected = new FormControl(1);
      this.showHideOB=true;
      sendTextRootPath="Onboarding";
    }
    else if (val == 'resourcePlan') {
      this.selected = new FormControl(0);
      this.showHideRP=true;
      sendTextRootPath="Onboarding";
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "data"   : encodeURIComponent(val),
      }
  };
  
  this.router.navigate([sendTextRootPath], navigationExtras);
  setTimeout(()=>{
    this.loadVaiable=true;
  },4000)
  }

  userDetails: userProfileDetails;
 // _roleGetPermissionResourcePlanOpenOrder:any=[];
 // _roleGetPermissionOnboarding:any=[];
 // _roleGetPermissionResourceMaster:any=[];
 // _roleGetPermissionDeboarding:any=[];
 // _roleGetPermissionChangeManagement: any = [];
  getRolePermission() {
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details')); 
   // this._roleGetPermissionResourcePlanOpenOrder=[];
    //this._roleGetPermissionOnboarding=[];
   // this._roleGetPermissionResourceMaster=[];
    //this._roleGetPermissionDeboarding=[];
   // this._roleGetPermissionChangeManagement = [];
    if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {
       let _fetaturedetailsArray = [];
       _fetaturedetailsArray = this.userDetails?.roleDetail[0]?.roleDetails[0]?.moduleDetails?.filter((v) => { return v.moduleName == "Resource" });
      if (_fetaturedetailsArray && _fetaturedetailsArray?.length > 0) {
//          this._roleGetPermissionResourcePlanOpenOrder= (_fetaturedetailsArray[0]?.featureDetails)?.filter(v1 => { return v1.featureCode == "ResourceOpenOrder" })[0]?.permissionDetails[0];
// if(this._roleGetPermissionResourcePlanOpenOrder && this._roleGetPermissionResourcePlanOpenOrder?.length==0){
//   this._roleGetPermissionResourcePlanOpenOrder = {
//     createPermission: false,
//     importPermission: false,
//     editPermission: false,
//     approvePermission: false,
//     delegatePermission: false,
//     deletePermission: false,
//     exportPermission: false,
//     readPermission: false,
//     rejectPermission: false,
//     withdrawPermission: false
//   }
// }
        //  this._roleGetPermissionOnboarding = (_fetaturedetailsArray[0]?.featureDetails)?.filter(v1 => { return v1.featureCode == "Onboarding" })[0]?.permissionDetails[0];
        //  if(this._roleGetPermissionOnboarding && this._roleGetPermissionOnboarding?.length==0){
        //   this._roleGetPermissionOnboarding = {
        //     createPermission: false,
        //     importPermission: false,
        //     editPermission: false,
        //     approvePermission: false,
        //     delegatePermission: false,
        //     deletePermission: false,
        //     exportPermission: false,
        //     readPermission: false,
        //     rejectPermission: false,
        //     withdrawPermission: false
        //   }
        // }
        //  this._roleGetPermissionResourceMaster = (_fetaturedetailsArray[0]?.featureDetails).filter(v1 => { return v1.featureCode == "Resource Master" })[0]?.permissionDetails[0];
        //  if(this._roleGetPermissionResourceMaster && this._roleGetPermissionResourceMaster?.length==0){
        //   this._roleGetPermissionResourceMaster = {
        //     createPermission: false,
        //     importPermission: false,
        //     editPermission: false,
        //     approvePermission: false,
        //     delegatePermission: false,
        //     deletePermission: false,
        //     exportPermission: false,
        //     readPermission: false,
        //     rejectPermission: false,
        //     withdrawPermission: false
        //   }
        // }
        //  this._roleGetPermissionDeboarding = (_fetaturedetailsArray[0].featureDetails).filter(v1 => { return v1.featureCode == "Deboarding" })[0]?.permissionDetails[0];
        //  if(this._roleGetPermissionDeboarding && this._roleGetPermissionDeboarding?.length==0){
        //   this._roleGetPermissionDeboarding = {
        //     createPermission: false,
        //     importPermission: false,
        //     editPermission: false,
        //     approvePermission: false,
        //     delegatePermission: false,
        //     deletePermission: false,
        //     exportPermission: false,
        //     readPermission: false,
        //     rejectPermission: false,
        //     withdrawPermission: false
        //   }
        // }
        //  this._roleGetPermissionChangeManagement=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Change Management"})[0]?.permissionDetails[0];
        //  if(this._roleGetPermissionChangeManagement && this._roleGetPermissionChangeManagement?.length==0){
        //   this._roleGetPermissionChangeManagement = {
        //     createPermission: false,
        //     importPermission: false,
        //     editPermission: false,
        //     approvePermission: false,
        //     delegatePermission: false,
        //     deletePermission: false,
        //     exportPermission: false,
        //     readPermission: false,
        //     rejectPermission: false,
        //     withdrawPermission: false
        //   }
        // }
      }
      else {
        // this._roleGetPermissionResourcePlanOpenOrder = {
        //   createPermission: false,
        //   importPermission: false,
        //   editPermission: false,
        //   approvePermission: false,
        //   delegatePermission: false,
        //   deletePermission: false,
        //   exportPermission: false,
        //   readPermission: false,
        //   rejectPermission: false,
        //   withdrawPermission: false
        // }
        // this._roleGetPermissionOnboarding = {
        //   createPermission: false,
        //   importPermission: false,
        //   editPermission: false,
        //   approvePermission: false,
        //   delegatePermission: false,
        //   deletePermission: false,
        //   exportPermission: false,
        //   readPermission: false,
        //   rejectPermission: false,
        //   withdrawPermission: false
        // }
        // this._roleGetPermissionResourceMaster = {
        //   createPermission: false,
        //   importPermission: false,
        //   editPermission: false,
        //   approvePermission: false,
        //   delegatePermission: false,
        //   deletePermission: false,
        //   exportPermission: false,
        //   readPermission: false,
        //   rejectPermission: false,
        //   withdrawPermission: false
        // }
        // this._roleGetPermissionDeboarding = {
        //   createPermission: false,
        //   importPermission: false,
        //   editPermission: false,
        //   approvePermission: false,
        //   delegatePermission: false,
        //   deletePermission: false,
        //   exportPermission: false,
        //   readPermission: false,
        //   rejectPermission: false,
        //   withdrawPermission: false
        // }
        // this._roleGetPermissionChangeManagement = {
        //   createPermission: false,
        //   importPermission: false,
        //   editPermission: false,
        //   approvePermission: false,
        //   delegatePermission: false,
        //   deletePermission: false,
        //   exportPermission: false,
        //   readPermission: false,
        //   rejectPermission: false,
        //   withdrawPermission: false
        // }
     }
    }
   }
}
