import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmitOnboardingRequestDialogComponent } from '../submit-onboarding-request-dialog/submit-onboarding-request-dialog.component';
import * as moment from 'moment';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LoaderService } from 'src/app/services/loader.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { environment } from 'src/environments/environment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}

@Component({
  selector: 'app-onboarding-request-creation-details',
  templateUrl: './onboarding-request-creation-details.component.html',
  styleUrls: ['./onboarding-request-creation-details.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class OnboardingRequestCreationDetailsComponent implements OnInit {
  getElementData: any = [];
  createdForm: FormGroup;
  showLoading: boolean = false;
  todayDateShow: any = new Date();

  todayDateShowAfterSeven:any=new Date();

  expectedDOJDate: any = new Date();
  nationalityListRecords: any = [];
  nationalityListData: any = [];
  stdCodeListDataPrimary: any = [];
  stdCodeListDataAlternate: any = [];
  stdCodeListDataEmergency: any = [];

  salaryLevelStatus: any = "";
  listYear: any = [];
  vendorName: any = "";
  userDetailsRoles: any = [];
  remarksList: any = [];

  stdCodeListRecordsprimary: any = [];
  stdCodeListRecordsAlternate: any = [];
  stdCodeListRecordsEmergency: any = [];
  profileInformation: any = [];

  resourceObSowjdOrderDetailData:any=[];
resourceObOrganizationDetailData:any=[];
resourceObResourceDetailsData:any=[];
educationDetailsData:any=[];
vendorDetailsData:any=[];
onboardingDetailsList:any=[];
employeeMasterDetailsList:any=[];
ntIDDetailsList:any=[];
resourceCheckInDetailsList:any=[];
resourceIDcardIsuueDetailsList:any=[];
resourceShareNtidDetailsList:any=[];
onboardingBGVList:any=[];
bgvCompletedDetailsList:any=[];
bgvRequestDetailsList:any=[];
bgvInitiateDetailsList:any=[];

onboardingUploadFileList:any=[];
vendorMSAFileGet:any=[];
addressProofFileGet:any=[];
sscDocumnetFileGet:any=[];
highestDocumentFileGet:any=[];
photoDocumentFileGet:any=[];
purchaseOrderFileGet:any=[];
louFileGet:any=[];
bgvReportFileGet:any=[];
ispTrainingFileGet:any=[];
parentOrgFileGet:any=[];
relievingDocumentFileGet:any=[];
ispCertificateFileGet:any=[];
dooFileGet:any=[];
loaFileGet:any=[];
iClikedEditButton:boolean=false;
editSubmit:any="";
workLocationList:any=[];

maxDateOfBirth: Date;
minDateOfBirth:Date;
poLineItemsList:any=[];
getElementDataSignOff:any="";
getElementDataLocation:any="";
  constructor(private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private API: ApiResourceService, private fb: FormBuilder, private snackBar: MatSnackBar, public loaderService: LoaderService) {
    this.createdForm = this.fb.group({
      subWorkLocation: ['', Validators.required],
      poLineItem: ['', Validators.required],
      expectedDoj: ['', Validators.required],
      billable: ['', Validators.required],
      billableStartDate: [''],
      resourceType: ['Direct', Validators.required],
      registeredNameSubContractor: [''],
      domainIdSubContractor: [''],
      msaUploadFileFormControlName: [''],
      personalInfoTitle: ['', Validators.required],
      personalInfoFirstName: ['', Validators.required],
      personalInfoMiddleName: [''],
      personalInfoLastName: ['', Validators.required],
      personalInfoLastDOB: ['', Validators.required],
      personalInfoGender: ['', Validators.required],
      personalInfoNationality: ['', Validators.required],
      officialEmailID: ['', [Validators.required, Validators.email,]],///^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      otpValueFormControlName: [''],
      personalEmailID: ['', [Validators.required, Validators.email]],
      primaryCountryMobileCode: ['91', Validators.required],
      primaryContactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      alternateCountryMobileCode: ['91',],
      alternateContactNumber: ['', [Validators.minLength(10)]],
      emergencyContactName: ['', Validators.required],
      emergencyContactMobileCode: ['91', Validators.required],
      emergencyContactMobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      idType: ['', Validators.required],
      idNumber: ['', [Validators.required,Validators.minLength(10)]],
      proofIDType: ['', Validators.required],
      proofAddressUploadFileFormControlName: ['', Validators.required],
      residenceAddressHouseStreetNumber: ['', Validators.required],
      residenceAddressLandmark: ['', Validators.required],
      residenceAddressCity: ['', Validators.required],
      residenceAddressState: ['', Validators.required],
      residenceAddressPostalCode: ['', [Validators.required,Validators.minLength(6)]],
      residenceAddressCheckBox: [false],
      permanentAddressHouseStreet: ['', Validators.required],
      permanentAddressLandmark: ['', Validators.required],
      permanentAddressCity: ['', Validators.required],
      permanentAddressState: ['', Validators.required],
      permanentAddressPostalCode: ['', [Validators.required,Validators.minLength(6)]],
      sscBoard: ['', Validators.required],
      sscInstitution: ['', Validators.required],
      sscYearPassing: ['', Validators.required],
      sscPercentage: ['', Validators.required],
      sscMode: ['', Validators.required],
      sscUploadFileFormControlName: ['', Validators.required],
      highestQualification: [''],
      hqSpecialization: [''],
      hqInstitution: [''],
      hqYearPassing: [''],
      hqPercentage: [''],
      hqMode: [''],
      highestQualUploadFileFormControlName: [''],
      valueTotalExpYearFormControlName: [0],
      valueTotalExpMonthFormControlName: [0],
      valueRelevantExpYearFormControlName: [0],
      valueRelevantExpMonthFormControlName: [0],
      workedPreviousYearFormControlName: ['', Validators.required],
      boschEmployeeNumber: [''],
      lwdBgsw: [''],
      photoUploadFileFormControlName: ['', Validators.required],
      purchaseOrderUploadFileFormControlName: ['', Validators.required],
      letterUndertakingUploadFileFormControlName: ['', Validators.required],
      backgroundVRUploadFileFormControlName: ['', Validators.required],
      ispTrainingUploadFileFormControlName: ['', Validators.required],
      parentOrgUploadFileFormControlName: ['', Validators.required],
      relievingletterUploadFileFormControlName: [''],
      ispSecurityUploadFileFormControlName: ['', Validators.required],
      dOOUploadFileFormControlName: ['', Validators.required],
      lOAUploadFileFormControlName: [''],
    });

  }

  ngOnInit() {
    this.maxDateOfBirth = new Date();
    this.maxDateOfBirth.setMonth(this.maxDateOfBirth.getMonth() - 12 * 18);
    this.minDateOfBirth = new Date();
    this.minDateOfBirth.setMonth(this.minDateOfBirth.getMonth() - 12 * 60);
    this.iClikedEditButton=false;
    this.editSubmit="";
    this.createdForm.controls['officialEmailID'].enable();
    this.createdForm.controls['domainIdSubContractor'].enable();
    this.route.queryParams.subscribe(params => {
      this.getElementData = JSON.parse(params.element);
      //this.workLocationList=JSON.parse(params.workLocationList)
      this.getElementDataSignOff = this.getElementData.technicalProposalNumber; 
      this.getElementDataLocation=this.getElementData.personalArea;
      if (params && params.draftEditOption == "EDIT") {
        this.iClikedEditButton=true;
        this.editSubmit=params.draftEditOption;
        this.getDetailsInformation(params);  
        this.getElementDataSignOff=""; 
        this.getElementDataSignOff =params.signOffId;
        this.getElementDataLocation="";
        this.getElementDataLocation=this.getElementData.personalArea;     
      }
      if (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack")) {   
        this.iClikedEditButton=true;    
        this.getDetailsInformation(params);
        this.verifiedOtp = true;
        this.createdForm.controls['officialEmailID'].disable();
        this.createdForm.controls['domainIdSubContractor'].disable();
      }
    });
    this.salaryLevelStatus = '';
    if (this.getElementData.outSourcingType == "Time and Material" || this.getElementData.outSourcingType.toLowerCase() == "time and material") {
      this.salaryLevelStatus = 'Level 83';
    }
    else {
      this.salaryLevelStatus = 'Level 84';
    }

    this.getExpectedDOJ();
    this.getNamtionaltyListOB();
    this.getstdCountryCode();
    this.getYearListDDl();
    this.getSalaryLevelConditionMethod();
    let _getLoginDetails = this.API.getFetchLoginDetailsFor()
    this.vendorName = _getLoginDetails.profile.name;
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    this.profileInformation = _getLoginDetails.profile;
    this.createdForm.controls['alternateContactNumber'].valueChanges.subscribe(c => {
      let pc = this.createdForm.controls.primaryContactNumber.value;
      if ((pc == c) && (pc.length == c.length)  &&  pc.length>0 && c.length>0) {
        this.snackBar.open("Primary contact number and Alternate contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'alternateContactNumber': '' });
      }
      let ac = this.createdForm.controls.alternateContactNumber.value;
     if(ac==0 && ac.length==undefined){
      this.createdForm.patchValue({ 'alternateContactNumber': '' });
     }
     if(pc==0 && pc.length==undefined){
      this.createdForm.patchValue({ 'primaryContactNumber': '' });
     }

    });
    this.createdForm.controls['emergencyContactMobileNumber'].valueChanges.subscribe(c => {
      let pc = this.createdForm.controls.primaryContactNumber.value;
      let ac = this.createdForm.controls.alternateContactNumber.value;
      if ((pc == c) && (pc.length == c.length)  &&  pc.length>0 && c.length>0)  {
        this.snackBar.open("Primary contact number and Emergency contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'emergencyContactMobileNumber': '' });
      }
      if ((ac == c) && (ac.length == c.length)  &&  ac.length>0 && c.length>0) {
        this.snackBar.open("Alternate contact number and Emergency contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'emergencyContactMobileNumber': '' });
      }
      let ec = this.createdForm.controls.emergencyContactMobileNumber.value;
      if(ec==0 && ec.length==undefined){
        this.createdForm.patchValue({ 'emergencyContactMobileNumber': '' });
       }
    });
    this.getPOLineItemBasedPlantId();
    this.API.getSASTokenForUpload(this.userDetailsRoles).subscribe((response: any) => {
      if (response && response.data) {
        this.forDownloadSSNtoken = response.data;
      }
    })

    this.createdForm.controls['residenceAddressHouseStreetNumber'].valueChanges.subscribe(c => {
      if(this.createdForm.controls['residenceAddressCheckBox'].value==true){
        let houseStreet = this.createdForm.controls.residenceAddressHouseStreetNumber.value;
          this.createdForm.patchValue({ 'permanentAddressHouseStreet': houseStreet });
      }
    })

    this.createdForm.controls['residenceAddressLandmark'].valueChanges.subscribe(c => {
      if(this.createdForm.controls['residenceAddressCheckBox'].value==true){
        let addressRes = this.createdForm.controls.residenceAddressLandmark.value;
          this.createdForm.patchValue({ 'permanentAddressLandmark': addressRes });
      }
    })
    this.createdForm.controls['residenceAddressCity'].valueChanges.subscribe(c => {
      if(this.createdForm.controls['residenceAddressCheckBox'].value==true){
        let addCity = this.createdForm.controls.residenceAddressCity.value;
          this.createdForm.patchValue({ 'permanentAddressCity': addCity });
      }
    })
    this.createdForm.controls['residenceAddressState'].valueChanges.subscribe(c => {
      if(this.createdForm.controls['residenceAddressCheckBox'].value==true){
        let addState = this.createdForm.controls.residenceAddressState.value;
          this.createdForm.patchValue({ 'permanentAddressState': addState });
      }
    })
    this.createdForm.controls['residenceAddressPostalCode'].valueChanges.subscribe(c => {
      if(this.createdForm.controls['residenceAddressCheckBox'].value==true){
        let addPinCode = this.createdForm.controls.residenceAddressPostalCode.value;
          this.createdForm.patchValue({ 'permanentAddressPostalCode': addPinCode });
      }
    })

  }
  forDownloadSSNtoken:any="";
  getPOLineItemBasedPlantId(){
    this.poLineItemsList= [];
    this.workLocationList=[];
    let obj={
      "plantID":this.getElementData?.plantid,
      "purchaseOrder":this.getElementData?.purchaseOrder
    }
    this.loaderService.setShowLoading();
    if(this.getElementData && this.getElementData.plantid && this.getElementData.purchaseOrder){
   
    this.API.getPOLineItemBasedPlantIdOB(obj).subscribe((res:any)=>{
      this.loaderService.setDisableLoading();
      if(res && res.data && res.data.poLineitems && res.data.poLineitems.length>0){       
      let  uniqueArray = res.data.poLineitems.filter(function(item, pos) {
          return res.data.poLineitems.indexOf(item) == pos;
      })
      this.poLineItemsList=  uniqueArray.sort((a, b) => a - b);
      }
      else if(res && res.data && res.data.poLineitems && res.data.poLineitems.length==0){
        this.snackBar.open("PO Line Items Data Not Found, You can't submit without Data*", 'Close', {
          duration: 5000,
        });
      }
      else{
        this.poLineItemsList= ['0']
      }
      if(res && res.data && res.data.plantInformation){
        this.workLocationList= res.data.plantInformation;
        if(this.workLocationList && this.workLocationList.length==0){
          this.snackBar.open("Work Location Data Not Found, You can't submit without Data*", 'Close', {
            duration: 5000,
          });
        }
        else{
          let filterWrkLoc=this.workLocationList.filter((v)=>{return v.name==this.getElementData?.workLocation})[0];
          if(filterWrkLoc){
          this.createdForm.patchValue({ 'subWorkLocation':filterWrkLoc});
          }
        }
      }
    
    })
  }
  else{ 
    this.poLineItemsList= ['0'];
    this.snackBar.open("Work Location Data Not Found, You can't submit without Data*", 'Close', {
      duration: 5000,
    });
  }
  }
  getDategetDateSubmitDate:any="";
  getDateFirstLevelSentBackDate:any="";
  getDateSecondLevelSentBackDate:any="";
  getDateFirstLevelApprovedDate:any="";
  onboardingFirstApproveList:any=[];
  getDetailsInformation(params:any) {
    this.loaderService.setShowLoading();
    this.API.getDetailsInformationOBbyID(this.getElementData.id, this.userDetailsRoles).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      if (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack") ) {  
      if (response && response.data && response.data.resourceObRemarks) {
        this.remarksList = response.data.resourceObRemarks;
        let getDateSubmit=   this.remarksList.filter((v=>{
          return v.statusDescription=="Submitted"
        }));
        if(getDateSubmit && getDateSubmit.length>0){
          this.getDategetDateSubmitDate=getDateSubmit[0].createdOn;
          }


                
          let getDateFirstLevelSentBack=   this.remarksList.filter((v=>{
            return v.statusDescription== "First Level Sent Back"
          }));
          if(getDateFirstLevelSentBack && getDateFirstLevelSentBack.length>0){
            this.getDateFirstLevelSentBackDate=getDateFirstLevelSentBack[0].createdOn;
            }

            
            let getDateFirstLevelApproved=   this.remarksList.filter((v=>{
              return v.statusDescription== "First Level Approved"
            }));
            if(getDateFirstLevelApproved && getDateFirstLevelApproved.length>0){
              this.getDateFirstLevelApprovedDate=getDateFirstLevelApproved[0].createdOn;
              }
        
            let getDateSecondLevelSentBack=   this.remarksList.filter((v=>{
              return v.statusDescription== "Second Level Sent Back"
            }));
            if(getDateSecondLevelSentBack && getDateSecondLevelSentBack.length>0){
              this.getDateSecondLevelSentBackDate=getDateSecondLevelSentBack[0].createdOn;
              }
  
      }
    }
      if((this.userDetailsRoles=='/Vendors' && params && params.draftEditOption == "EDIT") || (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack")) ){
      if (response && response.data && response.data.resourceObSowjdOrderDetail) {
        this.resourceObSowjdOrderDetailData = response.data.resourceObSowjdOrderDetail[0];
        if (this.resourceObSowjdOrderDetailData && (this.resourceObSowjdOrderDetailData.outSourcingType == "Time and Material" || this.resourceObSowjdOrderDetailData.outSourcingType.toLowerCase() == "time and material")) {
          this.salaryLevelStatus = 'Level 83';
        }
        else {
          this.salaryLevelStatus = 'Level 84';
        }
      }
   
      if (response && response.data && response.data.resourceObOrganizationDetail) {
        this.resourceObOrganizationDetailData = response.data.resourceObOrganizationDetail[0];
      }
      if (response && response.data && response.data.resourceObResourceDetail) {
        this.resourceObResourceDetailsData = response.data.resourceObResourceDetail[0];
      }
      if (response && response.data && response.data.resourceObVendorDetail) {
        this.vendorDetailsData = response.data.resourceObVendorDetail[0];
      }
      if (response && response.data && response.data.resourceObEducationExperienceDetail) {
        this.educationDetailsData = response.data.resourceObEducationExperienceDetail[0];
      }   
      if (response && response.data && response.data.firstApprovalInfo) {
        this.onboardingFirstApproveList = response.data.firstApprovalInfo[0];

      }
      
      if(response && response.data && response.data.resourceOBDocumentDetail){
        this.onboardingUploadFileList=response.data.resourceOBDocumentDetail;  
        this.vendorMSAFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="VendorMSA"})[0];
        this.addressProofFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="AddressProof"})[0];
        this.sscDocumnetFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="SSCDocument"})[0];
        this.highestDocumentFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="HQDocument"})[0];
        this.photoDocumentFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="PhotoDocument"})[0];
        this.purchaseOrderFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="PODocument"})[0];
        this.louFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="LOUDocument"})[0];
        this.bgvReportFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="BGVRDocument"})[0];
        this.ispTrainingFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="ISPTrainingDocument"})[0];
        this.parentOrgFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="ParentOrgDocument"})[0];
        this.relievingDocumentFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="RelievingDocument"})[0];
        this.ispCertificateFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="ISPCertificateDocument"})[0];
        this.dooFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="DOODocument"})[0];
        this.loaFileGet=this.onboardingUploadFileList.filter((v:any)=>{return v.resourceType=="LOADocument"})[0];  
      
        this.msaUploadFileName= this.vendorMSAFileGet?this.vendorMSAFileGet.documentName : "";
        this.proofAdressUploadFileName= this.addressProofFileGet?this.addressProofFileGet.documentName : "";
        this.sscEducationUploadFileName= this.sscDocumnetFileGet? this.sscDocumnetFileGet.documentName : "";
      this.highestEducationUploadFileName= this.highestDocumentFileGet?this.highestDocumentFileGet.documentName :"";
      this.photoUploadFileName= this.photoDocumentFileGet?this.photoDocumentFileGet.documentName : "";
      this.purchaseOrderUploaddFileName=this.purchaseOrderFileGet?this.purchaseOrderFileGet.documentName : "";
      this.letterofUndertakingrUploadfileName=this.louFileGet?this.louFileGet.documentName :"";
      this.backgroundVerificationReportUploadfileName =this.bgvReportFileGet?this.bgvReportFileGet.documentName : "";
      
      this.parentOrgUploadfileName =this.parentOrgFileGet? this.parentOrgFileGet.documentName : "";
      this.iSPTrainingUploadfileName =this.ispTrainingFileGet? this.ispTrainingFileGet.documentName : "";
      this.releivingLetterUploadfileName =this.relievingDocumentFileGet? this.relievingDocumentFileGet.documentName : "";
      this.ispSecurityUploadfileName =this.ispCertificateFileGet?this.ispCertificateFileGet.documentName : "";
      this.dOOUploadfileName = this.dooFileGet?this.dooFileGet.documentName : "";
      this.loaUploadfileName = this.loaFileGet?this.loaFileGet.documentName : "";
      }
      // if (response && response.data && response.data.resourceOBOnboardingDetail) {
      //   this.onboardingDetailsList = response.data.resourceOBOnboardingDetail;
      //   this.employeeMasterDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Employee Master" })[0];
      //   this.ntIDDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "NT ID" })[0];
      //   this.resourceCheckInDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Resource Check In" })[0];
      //   this.resourceIDcardIsuueDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "ID Card Issue" })[0];
      //   this.resourceShareNtidDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Share NT ID" })[0];
      // }
      // if (response && response.data && response.data.resourceObBgvDetail) {
      //   this.onboardingBGVList = response.data.resourceObBgvDetail;
      //   this.bgvCompletedDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "BGV Completed" })[0];
      //   this.bgvRequestDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "BGV Request" })[0];
      //   this.bgvInitiateDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "Initiate BGV" })[0];
      // }
      this.  getEditFetchRecord(params);
    }

    if(params && (params.statusSentBack == "FirstLevelSentBack")){
  if(this.userDetailsRoles == '/Vendors'){
    this.enabledFirstLevelFunction();
    this.disabledSecondLevelFunction();
    //this.createdForm.controls['resourceType'].enable();
  }
  else{
    this.disabledFirstLevelFunction();
    this.disabledSecondLevelFunction();
   // this.createdForm.controls['resourceType'].disable();
  }
  let obSendbackRemarkDetail=[];
  obSendbackRemarkDetail= response?.data?.resourceObSendbackRemarkDetail;
this.sowJdSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == "SowjdSection" })[0];
this.organizationSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == "OrganizationSection" })[0];

  
 }
 else if(params && (params.statusSentBack == "SecondLevelSentBack")){
  if(this.userDetailsRoles == '/Vendors'){
    this.disabledFirstLevelFunction();
   // this.enabledSecondLevelFunction();
    this.disabledSecondLevelFunction();
    if(response && response.data && response.data.resourceObSendbackRemarkDetail){
      let obSendbackRemarkDetail=[];
       obSendbackRemarkDetail= response?.data?.resourceObSendbackRemarkDetail;

this.vendorSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='VendorSection'})[0];
if( this.vendorSectionFilter){        
  this.vendorSectionEnabled();
}
else{
  this.vendorSectionDisabled();
}
this.personalInfoSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='PersonalInformationSection'})[0];
if( this.personalInfoSectionFilter){        
 this.personalInformationEnabled();
}
else{
  this.personalInformationDisabled();
}
this.contactInformationSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='ContactInformationSection'})[0];
if( this.contactInformationSectionFilter){        
 this.contactInfoEnabled();
}
else{
  this.contactInfoDisabled();
}
this.identityInformationSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='IdentityInformationSection'})[0];
if( this.identityInformationSectionFilter){        
  this.identityInformationEnabled()

}
else{
  this.identityInformationDisabled()
}
this.addressProofSectionSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='AddressProofSection'})[0];
if( this.addressProofSectionSectionFilter){        
  this.createdForm.controls['proofIDType'].enable();
}
else{
  this.createdForm.controls['proofIDType'].disable();
}
this.residenceSectionSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='ResidenceSection'})[0];
if( this.residenceSectionSectionFilter){        
 this.residenceAddressEnaabled();

}
else{;
 this.residenceAddressDisabled();
}
this.sscSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='SSCSection'})[0];
if( this.sscSectionFilter){        
  this.sectionSSCEnabled();
}
else{
this.sectionSSCDisabled();
}
this.hqSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='HQSection'})[0];
if( this.hqSectionFilter){        
  this.sectionHQEnabled();
  
}
else{
this.sectionHQDisabled();
}
this.workExperienceSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='WorkExperienceSection'})[0];
this.previousWorkedSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='PreviousWorkedSection'})[0];
if( this.previousWorkedSectionFilter){        
  this.createdForm.controls['workedPreviousYearFormControlName'].enable();
      this.createdForm.controls['boschEmployeeNumber'].enable();
      this.createdForm.controls['lwdBgsw'].enable();
}
else{
  this.createdForm.controls['workedPreviousYearFormControlName'].disable();
  this.createdForm.controls['boschEmployeeNumber'].disable();
  this.createdForm.controls['lwdBgsw'].disable();
}
this.photoSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='PhotoSection'})[0];
 this.poSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='PurchaseOrderSection'})[0];
this.louSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='LouSection'})[0];
this.bvrSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='BvrSection'})[0];
this.ispTrainingSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='IspTrainingSection'})[0];
this.parentOrgSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='ParentOrgCardSection'})[0];
this.dooSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='DOOSection'})[0];
 this.ispCertificateSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='IspCertificateSection'})[0];
this.releavingSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='ReleivingLetterSection'})[0];
this.loaSectionFilter= obSendbackRemarkDetail?.filter((v:any)=>{return v.section=='LOASection'})[0];
 
    }
  }
  else{
    this.disabledFirstLevelFunction();
    this.disabledSecondLevelFunction();
    this.createdForm.controls['resourceType'].disable();
  }

  if(this.createdForm.controls['resourceType'].value=='Contract'){
   this.showHideContractDiv=true;
  }
 }
 else{
  this.enabledFirstLevelFunction();
  this.enabledSecondLevelFunction();
 }
    })
  }


  sowJdSectionFilter:any=[];
  organizationSectionFilter:any=[];

  vendorSectionFilter:any=[];
  personalInfoSectionFilter:any=[];
  contactInformationSectionFilter:any=[];
  identityInformationSectionFilter:any=[];
  addressProofSectionSectionFilter:any=[];
  residenceSectionSectionFilter:any=[];
  sscSectionFilter:any=[];
  hqSectionFilter:any=[];
  workExperienceSectionFilter:any=[];
  previousWorkedSectionFilter:any=[];
  photoSectionFilter:any=[];
  poSectionFilter:any=[];
  louSectionFilter:any=[];
  bvrSectionFilter:any=[];
  ispTrainingSectionFilter:any=[];
  parentOrgSectionFilter:any=[];
  dooSectionFilter:any=[];
  ispCertificateSectionFilter:any=[];
  releavingSectionFilter:any=[];
  loaSectionFilter:any=[];

  getEditFetchRecord(params:any) {
    this.getElementData={
      sowJdNumber:  this.resourceObSowjdOrderDetailData.soWJdID,
      sowjdDescription: this.resourceObSowjdOrderDetailData.sowjdDescription,
      sowJdType: this.resourceObSowjdOrderDetailData.sowJdType,
      skillsetName : this.resourceObSowjdOrderDetailData.skillset,
      grade:this.resourceObSowjdOrderDetailData.grade,
      outSourcingType: this.resourceObSowjdOrderDetailData.outSourcingType ,
      locationMode:this.resourceObSowjdOrderDetailData.location ,
      workLocation:  this.resourceObSowjdOrderDetailData.workLocation,
      purchaseOrder:  this.resourceObSowjdOrderDetailData.purchaseOrder,
      poLineItem: String(this.resourceObSowjdOrderDetailData.poLineitem),
      resourceOnboardingDate:  this.resourceObSowjdOrderDetailData.requestedDateofJoining,
      expectedDoj:this.resourceObSowjdOrderDetailData.expectedDateOfJoing,
      contractEndDate: this.resourceObSowjdOrderDetailData.contractEndDate,
      billable:this.resourceObSowjdOrderDetailData.isBillable,
      billingStartDate:this.resourceObSowjdOrderDetailData.billingStartDate,
      company:this.resourceObOrganizationDetailData.company,
      companyName:this.resourceObOrganizationDetailData.companyName,
      groupName:this.resourceObOrganizationDetailData.groupName,
      departmentName:this.resourceObOrganizationDetailData.departmentName,
      sectionName:this.resourceObOrganizationDetailData.sectionName,
      buName:this.resourceObOrganizationDetailData.buName,
      gbBusinessArea:this.resourceObOrganizationDetailData.gbBusinessArea,
      sectionSpoc:this.resourceObOrganizationDetailData.sectionSPOC,
      deliveryManager:this.resourceObOrganizationDetailData.deliveryManager,
      joiningLocation:this.resourceObOrganizationDetailData.joiningLocation,
      vendorSAPID: this.vendorDetailsData?.vendorId ,
      vendorName:  this.vendorDetailsData?.vendorName,
      vendorEmail: this.vendorDetailsData?.vendorEmail,
      resourceType: this.vendorDetailsData?.resourceType,
      domainIdSubContractor:  this.vendorDetailsData?.domainIdSubContractor,
     regNameSubContractor :this.vendorDetailsData?.regNameSubContractor,
     personalInfoTitle: this.resourceObResourceDetailsData.title  ,
     personalInfoFirstName: this.resourceObResourceDetailsData.firstName  ,
     personalInfoMiddleName: this.resourceObResourceDetailsData.middleName  ,
     personalInfoLastName: this.resourceObResourceDetailsData.lastName  ,
     personalInfoLastDOB : this.resourceObResourceDetailsData.dateofBirth  ,
     personalInfoGender: this.resourceObResourceDetailsData.gender  ,
     personalInfoNationality: this.resourceObResourceDetailsData.nationality  ,

     officialEmailID:  this.resourceObResourceDetailsData.officialEmailId ,
     personalEmailID:this.resourceObResourceDetailsData.personalEmailId ,
     primaryCountryMobileCode:this.resourceObResourceDetailsData.primaryContactCode ,
     primaryContactNumber :  Number(this.resourceObResourceDetailsData.primaryContactNumber) ,
     alternateCountryMobileCode :this.resourceObResourceDetailsData.alternateContactCode ,
     alternateContactNumber: Number(this.resourceObResourceDetailsData.alternateContactNumber) ,
     emergencyContactName: this.resourceObResourceDetailsData.emergencyContactName ,
     emergencyContactMobileCode: this.resourceObResourceDetailsData.emergencyContactCode ,
     emergencyContactMobileNumber: Number(this.resourceObResourceDetailsData.emergencyNumber) ,
     idNumber: this.resourceObResourceDetailsData.idNumber,
     identityType:this.resourceObResourceDetailsData.identityType,
     poaIdType:this.resourceObResourceDetailsData.poaIdType,
      residentAddressHouseNoStreet:this.resourceObResourceDetailsData.residentAddressHouseNoStreet,
      residentAddressLandMark:this.resourceObResourceDetailsData.residentAddressLandMark,
      residentAddressCity:this.resourceObResourceDetailsData.residentAddressCity,
      residentAddressState:this.resourceObResourceDetailsData.residentAddressState,
      residentAddressPostalCode:this.resourceObResourceDetailsData.residentAddressPostalCode,
      permanentAddressHouseNoStreet:this.resourceObResourceDetailsData.permanentAddressHouseNoStreet,
      permanentAddressLandMark:this.resourceObResourceDetailsData.permanentAddressLandMark,
      permanentAddressCity:this.resourceObResourceDetailsData.permanentAddressCity,
      permanentAddressState:this.resourceObResourceDetailsData.permanentAddressState,
      permanentAddressPostalCode:this.resourceObResourceDetailsData.permanentAddressPostalCode,
      sscBoard:this.educationDetailsData.sscBoard ,
      sscInstitution:this.educationDetailsData.sscInstitution ,
      sscYearPassing:Number(this.educationDetailsData.sscYearofPass) ,
      sscPercentage:this.educationDetailsData.sscPercentage ,
      sscMode:this.educationDetailsData.sscMode ,
      highestQualification :this.educationDetailsData.highestQualification  ,
      hqSpecialization:this.educationDetailsData.highestSpecialization  ,
      hqInstitution:this.educationDetailsData.highestInstitution  ,
      hqYearPassing:Number(this.educationDetailsData.highestYearofPass)  ,
      hqPercentage:this.educationDetailsData.highestPercentage  ,
      hqMode:this.educationDetailsData.highestMode  ,
      valueTotalExpYear:this.educationDetailsData.totalExperienceYear,
      valueTotalExpMonth:this.educationDetailsData.totalExperienceMonth,
      valueRelevantExpYear:this.educationDetailsData.relevantExperienceYear,
      valueRelevantExpMonth:this.educationDetailsData.relevantExperienceMonth,
      isWorkedPreviousYear:  this.educationDetailsData.isPreviouslyWorkedinBGSW==false?'No':'Yes',
      boschEmployeeNumber: this.educationDetailsData.boschEmployeeNumber,
      lwdBgsw: this.educationDetailsData.lwDatBGSW,
        }
if((params && params.statusSentBack == "FirstLevelSentBack")){
  this.getElementData.statusdescription='First Level Sent Back';
}
if( params.statusSentBack == "SecondLevelSentBack"){
  this.getElementData.statusdescription='Second Level Sent Back';
}
 let filterWrkLoc=this.workLocationList.filter((v)=>{return v.name==this.getElementData.workLocation})[0]
       this.createdForm.patchValue({ 'subWorkLocation':filterWrkLoc});// this.getElementData.workLocation });
       this.createdForm.patchValue({ 'poLineItem': this.getElementData.poLineItem });
      this.createdForm.patchValue({ 'billable': this.getElementData.billable==true?'True':'False'});
      this.createdForm.patchValue({ 'billableStartDate': new Date(this.getElementData.billingStartDate) });

let _getExpectedDoj=new Date(this.getElementData?.expectedDoj);
let forCheckTodaydateforEcpected=new Date();
if(forCheckTodaydateforEcpected < _getExpectedDoj){
  _getExpectedDoj=new Date(this.getElementData?.expectedDoj);
}
else{
  this.getExpectedDOJ();
  _getExpectedDoj=new Date( this.todayDateShowAfterSeven);
}

        this.createdForm.patchValue({ 'expectedDoj': _getExpectedDoj });
        this.minBillingDateShow = new Date(this.getElementData.expectedDoj);
      this.createdForm.patchValue({ 'resourceType': this.getElementData.resourceType });
      this.createdForm.patchValue({ 'domainIdSubContractor': this.getElementData.domainIdSubContractor });
      this.createdForm.patchValue({ 'registeredNameSubContractor': this.getElementData.regNameSubContractor });
      this.createdForm.patchValue({ 'personalInfoTitle': this.getElementData.personalInfoTitle });
      this.createdForm.patchValue({ 'personalInfoFirstName': this.getElementData.personalInfoFirstName});
      this.createdForm.patchValue({ 'personalInfoMiddleName': this.getElementData.personalInfoMiddleName});
      this.createdForm.patchValue({ 'personalInfoLastName': this.getElementData.personalInfoLastName });
      this.createdForm.patchValue({ 'personalInfoLastDOB': this.getElementData.personalInfoLastDOB });
      this.createdForm.patchValue({ 'personalInfoGender': this.getElementData.personalInfoGender });
      this.createdForm.patchValue({ 'personalInfoNationality': this.getElementData.personalInfoNationality });
      this.createdForm.patchValue({ 'officialEmailID': this.getElementData.officialEmailID });
      this.createdForm.patchValue({ 'personalEmailID': this.getElementData.personalEmailID });
      this.createdForm.patchValue({ 'primaryCountryMobileCode': this.getElementData.primaryCountryMobileCode?.trim()});
      this.createdForm.patchValue({ 'primaryContactNumber': this.getElementData.primaryContactNumber });
      this.createdForm.patchValue({ 'alternateCountryMobileCode':this.getElementData.alternateCountryMobileCode?.trim() });
      this.createdForm.patchValue({ 'alternateContactNumber': this.getElementData.alternateContactNumber });      
      this.createdForm.patchValue({ 'emergencyContactName': this.getElementData.emergencyContactName });
      this.createdForm.patchValue({ 'emergencyContactMobileCode': this.getElementData.emergencyContactMobileCode?.trim()  });
      this.createdForm.patchValue({ 'emergencyContactMobileNumber': this.getElementData.emergencyContactMobileNumber });
      this.createdForm.patchValue({ 'idType': this.getElementData.identityType });
      this.createdForm.patchValue({ 'idNumber': this.getElementData.idNumber });
      this.createdForm.patchValue({ 'proofIDType': this.getElementData.poaIdType });
      this.createdForm.patchValue({ 'residenceAddressHouseStreetNumber': this.getElementData.residentAddressHouseNoStreet });
      this.createdForm.patchValue({ 'residenceAddressLandmark': this.getElementData.residentAddressLandMark });
      this.createdForm.patchValue({ 'residenceAddressCity': this.getElementData.residentAddressCity });
      this.createdForm.patchValue({ 'residenceAddressState': this.getElementData.residentAddressState });
      this.createdForm.patchValue({ 'residenceAddressPostalCode': this.getElementData.residentAddressPostalCode });      
      this.createdForm.patchValue({ 'permanentAddressHouseStreet': this.getElementData.permanentAddressHouseNoStreet });
      this.createdForm.patchValue({ 'permanentAddressLandmark': this.getElementData.permanentAddressLandMark });
      this.createdForm.patchValue({ 'permanentAddressCity': this.getElementData.permanentAddressCity });
      this.createdForm.patchValue({ 'permanentAddressState': this.getElementData.permanentAddressState });
      this.createdForm.patchValue({ 'permanentAddressPostalCode': this.getElementData.permanentAddressPostalCode });

      this.createdForm.patchValue({ 'sscBoard': this.getElementData.sscBoard  });
      this.createdForm.patchValue({ 'sscInstitution': this.getElementData.sscInstitution  });
      this.createdForm.patchValue({ 'sscYearPassing': this.getElementData.sscYearPassing  });
      this.createdForm.patchValue({ 'sscPercentage': this.getElementData.sscPercentage  });
      this.createdForm.patchValue({ 'sscMode': this.getElementData.sscMode  });

      this.createdForm.patchValue({ 'highestQualification': this.getElementData.highestQualification });
      this.createdForm.patchValue({ 'hqSpecialization': this.getElementData.hqSpecialization });
      this.createdForm.patchValue({ 'hqInstitution': this.getElementData.hqInstitution });
      this.createdForm.patchValue({ 'hqYearPassing': this.getElementData.hqYearPassing });
      this.createdForm.patchValue({ 'hqPercentage': this.getElementData.hqPercentage });
      this.createdForm.patchValue({ 'hqMode': this.getElementData.hqMode });

      this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': this.getElementData.valueTotalExpYear });
      this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': this.getElementData.valueTotalExpMonth });
      this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': this.getElementData.valueRelevantExpYear });
      this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.getElementData.valueRelevantExpMonth });
      this.createdForm.patchValue({ 'workedPreviousYearFormControlName': this.getElementData.isWorkedPreviousYear  });  
      this.createdForm.patchValue({ 'boschEmployeeNumber': this.getElementData.boschEmployeeNumber  });
      this.createdForm.patchValue({ 'lwdBgsw': this.getElementData.lwdBgsw  });


      if((params && params.statusSentBack == "FirstLevelSentBack")|| (params && params.draftEditOption == "EDIT") || (params && params.statusSentBack == "SecondLevelSentBack")){
        this.createdForm.controls['msaUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['proofAddressUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['sscUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['photoUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['purchaseOrderUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['letterUndertakingUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['backgroundVRUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['ispTrainingUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['parentOrgUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['dOOUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['ispSecurityUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['relievingletterUploadFileFormControlName'].setValidators(null);
        this.createdForm.controls['lOAUploadFileFormControlName'].setValidators(null);
          this.createdForm.controls['highestQualUploadFileFormControlName'].setValidators(null);        
       
          this.createdForm.controls['msaUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['proofAddressUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['sscUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['photoUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['purchaseOrderUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['letterUndertakingUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['backgroundVRUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['ispTrainingUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['parentOrgUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['dOOUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['ispSecurityUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['relievingletterUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['lOAUploadFileFormControlName'].updateValueAndValidity();
        this.createdForm.controls['highestQualUploadFileFormControlName'].updateValueAndValidity();
      }


  }

  getSalaryLevelConditionMethod() {
    if (this.salaryLevelStatus == 'Level 83') {
      this.createdForm.controls['relievingletterUploadFileFormControlName'].setValidators([Validators.required]);
      this.createdForm.controls['lOAUploadFileFormControlName'].setValidators([Validators.required]);
      this.createdForm.controls['highestQualification'].setValidators([Validators.required]);
      this.createdForm.controls['hqSpecialization'].setValidators([Validators.required]);
      this.createdForm.controls['hqInstitution'].setValidators([Validators.required]);
      this.createdForm.controls['hqYearPassing'].setValidators([Validators.required]);
      this.createdForm.controls['hqPercentage'].setValidators([Validators.required]);
      this.createdForm.controls['hqMode'].setValidators([Validators.required]);
      this.createdForm.controls['highestQualUploadFileFormControlName'].setValidators([Validators.required]);
    }
    else if (this.salaryLevelStatus != 'Level 83') {
      this.createdForm.controls['relievingletterUploadFileFormControlName'].setValidators(null);
      this.createdForm.controls['lOAUploadFileFormControlName'].setValidators(null);
      this.createdForm.controls['highestQualification'].setValidators(null);
      this.createdForm.controls['hqSpecialization'].setValidators(null);
      this.createdForm.controls['hqInstitution'].setValidators(null);
      this.createdForm.controls['hqYearPassing'].setValidators(null);
      this.createdForm.controls['hqPercentage'].setValidators(null);
      this.createdForm.controls['hqMode'].setValidators(null);
      this.createdForm.controls['highestQualUploadFileFormControlName'].setValidators(null);
    }
    this.createdForm.controls['relievingletterUploadFileFormControlName'].updateValueAndValidity();
    this.createdForm.controls['lOAUploadFileFormControlName'].updateValueAndValidity();
    this.createdForm.controls['highestQualification'].updateValueAndValidity();
    this.createdForm.controls['hqSpecialization'].updateValueAndValidity();
    this.createdForm.controls['hqInstitution'].updateValueAndValidity();
    this.createdForm.controls['hqYearPassing'].updateValueAndValidity();
    this.createdForm.controls['hqPercentage'].updateValueAndValidity();
    this.createdForm.controls['hqMode'].updateValueAndValidity();
    this.createdForm.controls['highestQualUploadFileFormControlName'].updateValueAndValidity();
  }
  getYearListDDl() {
    var arrayYearList = [];
    for (var i = 1965; i <= new Date().getFullYear() +0; i++) {
      arrayYearList.push(i)
    }
    this.listYear =  arrayYearList.sort((a,b)=>b-a);
  }
  get f() { return this.createdForm.controls; }
  cancelBtn() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": encodeURIComponent('resourcePlan'),
      }
    };
    this.router.navigate(["Resource-Management"], navigationExtras);
    localStorage.removeItem('deBoardIDForStatus');
  }
  valueTotalExpYear = 0;
  valueTotalExpMonth = 0
  valueRelevantExpYear = 0
  valueRelevantExpMonth = 0
  handleMinusYear() {
    let _checkValueOfrelevant= this.createdForm.controls.valueRelevantExpYearFormControlName.value;
    if (this.valueTotalExpYear <= 0) {
      this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': 0 });
    }
    else {
      this.valueTotalExpYear--;
      this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': this.valueTotalExpYear });
let chekValueRotalExpYear=this.valueTotalExpYear;
if(_checkValueOfrelevant > chekValueRotalExpYear){
  this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName':chekValueRotalExpYear });
  this.valueRelevantExpYear=this.createdForm.controls.valueRelevantExpYearFormControlName.value;
} 
    }
  }
  handlePlusYear() {
    this.valueTotalExpYear++;
    this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': this.valueTotalExpYear });
  }

  handleMinusMonth() {
    if (this.valueTotalExpMonth <= 0) {
      this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': 0 });
    }
    else {
      this.valueTotalExpMonth--;
      this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': this.valueTotalExpMonth });

      if((this.valueTotalExpYear==this.valueRelevantExpYear) && (this.valueTotalExpMonth < this.valueRelevantExpMonth)){
        this.valueRelevantExpMonth =this.valueTotalExpMonth;
        this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.valueRelevantExpMonth });
      }
    }
  }
  handlePlusMonth() {
    if (this.valueTotalExpMonth >= 11) {
      this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': 11 });
    }
    else {
      this.valueTotalExpMonth++;
      this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': this.valueTotalExpMonth });
    }

  }
  handleMinusYearRE() {
    if (this.valueRelevantExpYear <= 0) {
      this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': 0 });
    }
    else {
      this.valueRelevantExpYear--;
      this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': this.valueRelevantExpYear });
    }

  }
  handlePlusYearRE() {
let _checkValueOftotal= this.createdForm.controls.valueTotalExpYearFormControlName.value;
if(_checkValueOftotal==this.valueRelevantExpYear){
return;
}
else{
    this.valueRelevantExpYear++;
    let _checkvalueofrelevant= this.valueRelevantExpYear;
    if(_checkValueOftotal < _checkvalueofrelevant){
      this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName':_checkValueOftotal });
    }
    else{
    this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': this.valueRelevantExpYear });
    }
  }
  }

  handleMinusMonthRE() {
    if (this.valueRelevantExpMonth <= 0) {
      this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': 0 });
    }
    else {
      this.valueRelevantExpMonth--;
      this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.valueRelevantExpMonth });
    }
  }
  handlePlusMonthRE() {
    if (this.valueRelevantExpMonth >= 11) {
      this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': 11 });
    }
    else {
      this.valueRelevantExpMonth++;      
      this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.valueRelevantExpMonth });

      if((this.valueTotalExpYear==this.valueRelevantExpYear) && (this.valueTotalExpMonth < this.valueRelevantExpMonth)){
        this.valueRelevantExpMonth =this.valueTotalExpMonth;
        this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.valueRelevantExpMonth });
      }
    }
  }
  msaUploadFileName: any = "";
  proofAdressUploadFileName: any = "";
  sscEducationUploadFileName: any = "";
  highestEducationUploadFileName: any = "";
  photoUploadFileName: any = "";
  purchaseOrderUploaddFileName: any = "";
  letterofUndertakingrUploadfileName: any = "";
  backgroundVerificationReportUploadfileName: any = "";
  parentOrgUploadfileName: any = "";
  iSPTrainingUploadfileName: any = "";
  releivingLetterUploadfileName: any = "";
  ispSecurityUploadfileName: any = "";
  dOOUploadfileName: any = "";
  loaUploadfileName: any = "";

  msaFinalResultUpload: any = {};
  addressProofFinalResultUpload: any = {};
  sscFinalResultUpload: any = {};
  hqdFinalResultUpload: any = {};
  photoFinalResultUpload: any = {};
  purchaseOrderFinalResultUpload: any = {};
  louFinalResultUpload: any = {};
  bgvrFinalResultUpload: any = {};
  ispTrainingFinalResultUpload: any = {};
  parentOrgFinalResultUpload: any = {};
  dooFinalResultUpload: any = {};
  ispCertificateFinalResultUpload: any = {};
  releavingFinalResultUpload: any = {};
  loaFinalResultUpload: any = {};


  uploadFileCommonMethod(uploadFileType, event) {
    let file = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = () => {
      let uploadObj: any = [];
      let resUpload = (reader.result.toString()).replace(/^data:image\/[a-z]+;base64,/, "").replace('data:application/pdf;base64,', "");
      uploadObj = {
        "id": null,
        "resourceId": null,
        "oldDocumentId": this.getElementData.id,
        "resourceType": uploadFileType,
        "documentName": file[0].name,
        "documentURL": null,
        "fileContent": resUpload
      }
      if (uploadFileType == 'VendorMSA') { this.msaFinalResultUpload = uploadObj; }
      if (uploadFileType == 'AddressProof') { this.addressProofFinalResultUpload = uploadObj; }
      if (uploadFileType == 'PhotoDocument') { this.photoFinalResultUpload = uploadObj; }
      if (uploadFileType == 'PODocument') { this.purchaseOrderFinalResultUpload = uploadObj; }
      if (uploadFileType == 'LOUDocument') { this.louFinalResultUpload = uploadObj; }
      if (uploadFileType == 'BGVRDocument') { this.bgvrFinalResultUpload = uploadObj; }
      if (uploadFileType == 'ISPTrainingDocument') { this.ispTrainingFinalResultUpload = uploadObj; }
      if (uploadFileType == 'ParentOrgDocument') { this.parentOrgFinalResultUpload = uploadObj; }
      if (uploadFileType == 'DOODocument') { this.dooFinalResultUpload = uploadObj; }
      if (uploadFileType == 'ISPCertificateDocument') { this.ispCertificateFinalResultUpload = uploadObj; }
      if (uploadFileType == 'RelievingDocument') { this.releavingFinalResultUpload = uploadObj; }
      if (uploadFileType == 'LOADocument') { this.loaFinalResultUpload = uploadObj; }
      if (uploadFileType == 'SSCDocument') { this.sscFinalResultUpload = uploadObj; }
      if (uploadFileType == 'HQDocument') { this.hqdFinalResultUpload = uploadObj; }
    };
  }

  validateFileType(event: any,elementId:any) {
    let result = false;
    let file = event.target.files;
    var size1 = Number((file[0].size / 1024 / 1024).toFixed(2));//In MB
   
    var fileName = file[0].name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

    if (((extFile == "pdf") && (elementId !='photoUpload'))) {
      if(size1 > 1 ) {       
        (document.getElementById(elementId) as HTMLInputElement).value="";
        this.snackBar.open("File size upto 1 MB is allowed*", 'Close', {
          duration: 5000,
        });
        result = false;
        return;
    } 
      result = true;
      return result;

    } 
    else if((extFile == "jpg" && (elementId =='photoUpload'))){
      if(size1 > 1 ) {       
        (document.getElementById(elementId) as HTMLInputElement).value="";
        this.snackBar.open("File size upto 1 MB is allowed*", 'Close', {
          duration: 5000,
        });
        result = false;
        return;
    } 
      result = true;
      return result;
    }
    
    else {
      if(elementId =='photoUpload'){
        this.snackBar.open("Photo Allow only to upload JPG file format*", 'Close', {
          duration: 5000,
        });
      }
      else{
      this.snackBar.open("Only pdf file format is allowed!", 'Close', {
        duration: 5000,
      });
    }
      result = false;
      return result;
    }
  }

  changeUploadFileMSA(event: any) {
    let result = this.validateFileType(event,'msaUpload');
    if (result == true) {
      var fileInput = (document.getElementById('msaUpload')) as HTMLInputElement;
      this.msaUploadFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("VendorMSA", event);
    }
  }
  deleteUploadMSA() {
    this.msaUploadFileName = '';
    this.createdForm.patchValue({ 'msaUploadFileFormControlName': null });
    this.msaFinalResultUpload = {};
  }
  changeUploadFileProofAddress(event: any) {
    let result = this.validateFileType(event,'proofAdressUpload');
    if (result == true) {
      var fileInput = (document.getElementById('proofAdressUpload')) as HTMLInputElement;
      this.proofAdressUploadFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("AddressProof", event);
    }
  }
  deleteUploadProofAddress() {
    this.proofAdressUploadFileName = '';
    this.createdForm.patchValue({ 'proofAddressUploadFileFormControlName': null });
  }
  selectedFilesSSC: any = [];
  selFilesSSC: any = [];
  sscArrayFile: any = [];

  selectedFilesHighestQualification: any = [];
  selFileHighestQaul: any = [];
  highestDegreeArrayFile: any = [];
  changeUploadFileSSCeducation(event: any) {
    let result = this.validateFileType(event,'sscEducationUpload');
    if (result == true) {
      var fileInput = (document.getElementById('sscEducationUpload')) as HTMLInputElement;
      this.sscEducationUploadFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("SSCDocument", event);
      //start for multiple
      //     this.selectedFilesSSC = [];
      //     const element = event.currentTarget as HTMLInputElement;
      //     this.selFilesSSC = element.files;
      //     let fileList: FileList | null = element.files;
      //     if (fileList) {
      //       for (let itm in fileList) {
      //         let item: File = fileList[itm];
      //         if ((itm.match(/\d+/g) != null) && (!this.selectedFilesSSC.includes(item['name'])))
      //           this.selectedFilesSSC.push(item['name']);
      //       }
      //     }
      //  this.sscArrayFile=[];
      // for(let i=0;i<this.selFilesSSC .length;i++){
      //     let file= event.target.files;  
      //     const reader = new FileReader();
      //       reader.readAsDataURL(file[i]);
      //       reader.onload = () => {
      //         let uploadObj :any;
      //         let resUpload = reader.result as string;
      //         uploadObj = {
      //           "id": null,
      //           "resourceId": null,
      //           "resourceType": "SSCDocument",
      //           "documentName": file[i].name,
      //           "documentURL": null,
      //           "fileContent": resUpload
      //         }  
      //         this.sscArrayFile.push(uploadObj)
      //       }
      //     }
      //end for multiple
    }
  }
  deleteUploadSSCeducation(index: any) {
    this.sscEducationUploadFileName = "";
    this.createdForm.patchValue({ 'sscUploadFileFormControlName': null });

    // this.selectedFilesSSC.splice(index, 1);
    // this.sscArrayFile.splice(index, 1);
    // this.createdForm.patchValue({ 'sscUploadFileFormControlName': this.selectedFilesSSC });
  }

  changeUploadFileHighestQual(event: any) {
    let result = this.validateFileType(event,'highestEducationUpload');
    if (result == true) {
      var fileInput = (document.getElementById('highestEducationUpload')) as HTMLInputElement;
      this.highestEducationUploadFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("HQDocument", event);

      //     this.selectedFilesHighestQualification = [];
      //     const element = event.currentTarget as HTMLInputElement;
      //     this.selFileHighestQaul = element.files;
      //     let fileList: FileList | null = element.files;
      //     if (fileList) {
      //       for (let itm in fileList) {
      //         let item: File = fileList[itm];
      //         if ((itm.match(/\d+/g) != null) && (!this.selectedFilesHighestQualification.includes(item['name'])))
      //           this.selectedFilesHighestQualification.push(item['name']);
      //       }
      //     }
      //     this.highestDegreeArrayFile=[];
      // for(let i=0;i<this.selFileHighestQaul .length;i++){
      //     let file= event.target.files;  
      //     const reader = new FileReader();
      //       reader.readAsDataURL(file[i]);
      //       reader.onload = () => {
      //         let uploadObj :any;
      //         let resUpload = reader.result as string;
      //         uploadObj = {
      //           "id": null,
      //           "resourceId": null,
      //           "resourceType": "HQDocument",
      //           "documentName": file[i].name,
      //           "documentURL": null,
      //           "fileContent": resUpload
      //         }  
      //         this.highestDegreeArrayFile.push(uploadObj)
      //       }
      //     }
    }
  }
  deleteUploadHighestQual(index: any) {
    this.highestEducationUploadFileName = "";
    this.createdForm.patchValue({ 'highestQualUploadFileFormControlName': null });

    // this.selectedFilesHighestQualification.splice(index, 1);
    // this.highestDegreeArrayFile.splice(index, 1);
    // this.createdForm.patchValue({ 'highestQualUploadFileFormControlName': this.selectedFilesHighestQualification });
  }
  changeUploadPhoto(event: any) {
    let result = this.validateFileType(event,'photoUpload');
    if (result == true) {
      var fileInput = (document.getElementById('photoUpload')) as HTMLInputElement;
      this.photoUploadFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("PhotoDocument", event);
    }
  }
  deleteUploadPhoto() {
    this.photoUploadFileName = '';
    this.createdForm.patchValue({ 'photoUploadFileFormControlName': null });
  }

  changeUploadPurchaseOrder(event: any) {
    let result = this.validateFileType(event,'purchaseOrderUpload');
    if (result == true) {
      var fileInput = (document.getElementById('purchaseOrderUpload')) as HTMLInputElement;
      this.purchaseOrderUploaddFileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("PODocument", event);
    }
  }
  deleteUploadPurchaseOrder() {
    this.purchaseOrderUploaddFileName = '';
    this.createdForm.patchValue({ 'purchaseOrderUploadFileFormControlName': null });
  }
  changeUploadLetterUndertaking(event: any) {
    let result = this.validateFileType(event,'letterofUndertakingrUpload');
    if (result == true) {
      var fileInput = (document.getElementById('letterofUndertakingrUpload')) as HTMLInputElement;
      this.letterofUndertakingrUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("LOUDocument", event);
    }
  }
  deleteUploadLOU() {
    this.letterofUndertakingrUploadfileName = '';
    this.createdForm.patchValue({ 'letterUndertakingUploadFileFormControlName': null });
  }
  changeUploadBackgroundVerificationReport(event: any) {
    let result = this.validateFileType(event,'backgroundVerificationReportUpload');
    if (result == true) {
      var fileInput = (document.getElementById('backgroundVerificationReportUpload')) as HTMLInputElement;
      this.backgroundVerificationReportUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("BGVRDocument", event);
    }
  }
  deleteUploadBVR() {
    this.backgroundVerificationReportUploadfileName = '';
    this.createdForm.patchValue({ 'backgroundVRUploadFileFormControlName': null });
  }
  changeUploadISPTraining(event: any) {
    let result = this.validateFileType(event,'iSPTrainingUpload');
    if (result == true) {
      var fileInput = (document.getElementById('iSPTrainingUpload')) as HTMLInputElement;
      this.iSPTrainingUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("ISPTrainingDocument", event);
    }
  }
  deleteUploadISPTraining() {
    this.iSPTrainingUploadfileName = '';
    this.createdForm.patchValue({ 'ispTrainingUploadFileFormControlName': null });
  }
  changeUploadParentOrg(event: any) {
    let result = this.validateFileType(event,'parentOrgUpload');
    if (result == true) {
      var fileInput = (document.getElementById('parentOrgUpload')) as HTMLInputElement;
      this.parentOrgUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("ParentOrgDocument", event);
    }
  }
  deleteUploadParentOrg() {
    this.parentOrgUploadfileName = '';
    this.createdForm.patchValue({ 'parentOrgUploadFileFormControlName': null });
  }
  changeUploadRelievingLetter(event: any) {
    let result = this.validateFileType(event,'releivingLetterUpload');
    if (result == true) {
      var fileInput = (document.getElementById('releivingLetterUpload')) as HTMLInputElement;
      this.releivingLetterUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("RelievingDocument", event);
    }
  }
  deleteUploadReleivingLetter() {
    this.releivingLetterUploadfileName = '';
    this.createdForm.patchValue({ 'relievingletterUploadFileFormControlName': null });
  }
  changeUploadISPsecurity(event: any) {
    let result = this.validateFileType(event,'ispSecurityUpload');
    if (result == true) {
      var fileInput = (document.getElementById('ispSecurityUpload')) as HTMLInputElement;
      this.ispSecurityUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("ISPCertificateDocument", event);
    }
  }
  deleteUploadISPsecurity() {
    this.ispSecurityUploadfileName = '';
    this.createdForm.patchValue({ 'ispSecurityUploadFileFormControlName': null });
  }
  changeUploadDOO(event: any) {
    let result = this.validateFileType(event,'dooUpload');
    if (result == true) {
      var fileInput = (document.getElementById('dooUpload')) as HTMLInputElement;
      this.dOOUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("DOODocument", event);
    }
  }
  deleteUploadDOO() {
    this.dOOUploadfileName = '';
    this.createdForm.patchValue({ 'dOOUploadFileFormControlName': null });
  }
  changeUploadLOA(event: any) {
    let result = this.validateFileType(event,'loaUpload');
    if (result == true) {
      var fileInput = (document.getElementById('loaUpload')) as HTMLInputElement;
      this.loaUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("LOADocument", event);
    }
  }
  deleteUploadLOA() {
    this.loaUploadfileName = '';
    this.createdForm.patchValue({ 'lOAUploadFileFormControlName': null });
  }
  saveButton(type: any) {
    let _getPathUrl = environment.mailDeboardUrl;
    let showAlertSuccessMessage = "";
    this.showLoading = true;
    let statusId: number;
    if (type == 'Save Draft') {
      statusId = 1;
      this.onOBSubmitFirstCheckboxVallue = false;
      this.onOBSubmitSecondCheckboxVallue = false;
      this.onOBSubmitThirdCheckboxVallue = false;
      this.onOBSubmitRemarksTextVallue = "";
      showAlertSuccessMessage = "Data Saved Suceessfully..!!";
    }
    else if (type == 'Submit') {
      statusId = 2;
      showAlertSuccessMessage = "Thank you, Onboarding Form Submitted Suceessfully..!!";
    }
    else if (type == 'Resubmit') {
      statusId = 2;
      showAlertSuccessMessage = "Thank you, Onboarding Form Re-Submitted Suceessfully..!!";
    }
    let billSdate = null;
    let expectedDojdate = null;
    let lwdBgswDate = null;
    if ((this.f.billableStartDate.value == '') || (this.f.billableStartDate.value == 'Invalid date') || (this.f.billableStartDate.value == null)) {
      billSdate = null;
    }
    else {
      billSdate = moment(this.f.billableStartDate.value).format('YYYY-MM-DDTHH:mm:ss[Z]');
    }
    if ((this.f.expectedDoj.value == '') || (this.f.expectedDoj.value == 'Invalid date') || (this.f.expectedDoj.value == null)) {
      expectedDojdate = null;
    }
    else {
      expectedDojdate = moment(this.f.expectedDoj.value).format('YYYY-MM-DDTHH:mm:ss[Z]');
    }

    if ((this.f.lwdBgsw.value == '') || (this.f.lwdBgsw.value == 'Invalid date') || (this.f.lwdBgsw.value == null)) {
      lwdBgswDate = null;
    }
    else {
      lwdBgswDate = moment(this.f.lwdBgsw.value).format('YYYY-MM-DDTHH:mm:ss[Z]')
    }
    
if(type == 'Resubmit'){
  //Do for upload file for resubmit
  let msaFile:any="";
  if(this.createdForm.controls.resourceType.value=='Direct'){
    msaFile="";
  }
  else{
  msaFile=Object.keys(this.msaFinalResultUpload).length !=0 ?  this.msaFinalResultUpload : this.vendorMSAFileGet;
  }
  


   let adProfFile =  Object.keys(this.addressProofFinalResultUpload).length !=0 ?  this.addressProofFinalResultUpload: this.addressProofFileGet;
   let sscFile  = Object.keys(this.sscFinalResultUpload).length !=0 ?this.sscFinalResultUpload: this.sscDocumnetFileGet;
   let hqFile:any;
   if(this.hqdFinalResultUpload){
   hqFile = Object.keys(this.hqdFinalResultUpload).length !=0 ?  this.hqdFinalResultUpload : this.highestDocumentFileGet;
   }
   let photoFile = Object.keys(this.photoFinalResultUpload).length !=0 ?this.photoFinalResultUpload : this.photoDocumentFileGet;
   let poFile = Object.keys(this.purchaseOrderFinalResultUpload).length !=0 ?  this.purchaseOrderFinalResultUpload:this.purchaseOrderFileGet;
   let louFile = Object.keys(this.louFinalResultUpload).length !=0?this.louFinalResultUpload: this.louFileGet;
   let bvrFile=  Object.keys(this.bgvrFinalResultUpload).length !=0?  this.bgvrFinalResultUpload:this.bgvReportFileGet;
   let ispTrainingFile =  Object.keys(this.ispTrainingFinalResultUpload).length !=0?  this.ispTrainingFinalResultUpload:  this.ispTrainingFileGet;
   let parentOrgFile =   Object.keys(this.parentOrgFinalResultUpload).length !=0 ?  this.parentOrgFinalResultUpload :  this.parentOrgFileGet;
   let dooFile =Object.keys(this.dooFinalResultUpload).length !=0 ?this.dooFinalResultUpload: this.dooFileGet;
   let ispCertificateFile= Object.keys(this.ispCertificateFinalResultUpload).length !=0  ?this.ispCertificateFinalResultUpload : this.ispCertificateFileGet;
   let releivingFile:any;
   if(this.releavingFinalResultUpload){
     releivingFile = Object.keys(this.releavingFinalResultUpload).length !=0 ?this.releavingFinalResultUpload: this.relievingDocumentFileGet;
   }
   let loaFile:any;
   if(this.loaFinalResultUpload){
    loaFile =  Object.keys(this.loaFinalResultUpload).length !=0 ?this.loaFinalResultUpload :this.loaFileGet;
   }
   this.msaFinalResultUpload=msaFile;
  this.addressProofFinalResultUpload=adProfFile;
  this.sscFinalResultUpload=sscFile;  
  this.hqdFinalResultUpload=hqFile;
  this.photoFinalResultUpload=photoFile;
  this.purchaseOrderFinalResultUpload=poFile;
  this.louFinalResultUpload=louFile; 
  this.bgvrFinalResultUpload=bvrFile;
  this.ispTrainingFinalResultUpload=ispTrainingFile;
  this.parentOrgFinalResultUpload=parentOrgFile;
  this.dooFinalResultUpload=dooFile;
  this.ispCertificateFinalResultUpload =ispCertificateFile;
  this.releavingFinalResultUpload=releivingFile;
  this.loaFinalResultUpload=loaFile;
}

    let documentsModel: any = [
      { ...this.msaFinalResultUpload },
      { ...this.addressProofFinalResultUpload },
      { ...this.sscFinalResultUpload },
      { ...this.hqdFinalResultUpload },
      { ...this.photoFinalResultUpload },
      { ...this.purchaseOrderFinalResultUpload },
      { ...this.louFinalResultUpload },
      { ...this.bgvrFinalResultUpload },
      { ...this.ispTrainingFinalResultUpload },
      { ...this.parentOrgFinalResultUpload },
      { ...this.dooFinalResultUpload },
      { ...this.ispCertificateFinalResultUpload },
      { ...this.releavingFinalResultUpload },
      { ...this.loaFinalResultUpload },
    ];

    const documentsModelArray = documentsModel.filter(element => {
      if (Object.keys(element).length !== 0) {
        return true;
      }
      return false;
    });
    let obj =
    {
      "sowjdID": type == 'Resubmit'? this.getElementData.id : this.getElementData.sowjdID,
      "workLocation": this.f.subWorkLocation.value.name,
      "poLineitem": Number(this.f.poLineItem.value),
      "expectedDOJ": expectedDojdate,
      "isBillable": this.f.billable.value == 'True' ? true : this.f.billable.value == 'False' ? false : false,
      "billingStartDate": billSdate,
      "outSourcingType": this.getElementData.outSourcingType,
      "vendorId": this.userDetailsRoles == '/Vendors' ? this.profileInformation.vendor_id : '',// "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "resourceType": this.f.resourceType.value,
      "regNameSubContractor": this.f.registeredNameSubContractor.value,
      "domainIdSubContractor": this.f.domainIdSubContractor.value,
      "msaScopeExtensionUrl": this.msaUploadFileName,
      "title": this.f.personalInfoTitle.value,
      "firstName": this.f.personalInfoFirstName.value,
      "middleName": this.f.personalInfoMiddleName.value,
      "lastName": this.f.personalInfoLastName.value,
      "dateofBirth": this.f.personalInfoLastDOB.value,
      "gender": this.f.personalInfoGender.value,
      "nationality": this.f.personalInfoNationality.value,
      "officialEmailId": this.f.officialEmailID.value,
      "personalEmailId": this.f.personalEmailID.value,
      "primaryContactCode": this.f.primaryCountryMobileCode.value,
      "primaryContactNumber": String(this.f.primaryContactNumber.value),
      "alternateContactCode": this.f.alternateCountryMobileCode.value,
      "alternateContactNumber": String(this.f.alternateContactNumber.value),
      "emergencyContactName": this.f.emergencyContactName.value,
      "emergencyContactCode": this.f.emergencyContactMobileCode.value,
      "emergencyNumber": String(this.f.emergencyContactMobileNumber.value),
      "identityType": this.f.idType.value,
      "idNumber": this.f.idNumber.value,
      "poaIdType": this.f.proofIDType.value,
      "poaDocUrl": this.proofAdressUploadFileName,
      "residentAddressHouseNoStreet": this.f.residenceAddressHouseStreetNumber.value,
      "residentAddressLandMark": this.f.residenceAddressLandmark.value,
      "residentAddressCity": this.f.residenceAddressCity.value,
      "residentAddressState": this.f.residenceAddressState.value,
      "residentAddressPostalCode": this.f.residenceAddressPostalCode.value,
      "permanentAddressHouseNoStreet": this.f.permanentAddressHouseStreet.value,
      "permanentAddressLandMark": this.f.permanentAddressLandmark.value,
      "permanentAddressCity": this.f.permanentAddressCity.value,
      "permanentAddressState": this.f.permanentAddressState.value,
      "permanentAddressPostalCode": this.f.permanentAddressPostalCode.value,
      "sscBoard": this.f.sscBoard.value,
      "sscInstitution": this.f.sscInstitution.value,
      "sscYearofPass": this.f.sscYearPassing.value,
      "sscPercentage": this.f.sscPercentage.value,
      "sscMode": this.f.sscMode.value,
      "sscDocurl": this.selectedFilesSSC.toString(),
      "highestQualification": this.f.highestQualification.value,
      "highestSpecialization": this.f.hqSpecialization.value,
      "highestInstitution": this.f.hqInstitution.value,
      "highestYearofPass": this.f.hqYearPassing.value,
      "highestPercentage": this.f.hqPercentage.value,
      "highestMode": this.f.hqMode.value,
      "highestDocurl": this.selectedFilesHighestQualification.toString(),
      "totalExperienceYear": Number(this.f.valueTotalExpYearFormControlName.value),
      "totalExperienceMonth": Number(this.f.valueTotalExpMonthFormControlName.value),
      "relevantExperienceYear":  Number(this.f.valueRelevantExpYearFormControlName.value),
      "relevantExperienceMonth":  Number(this.f.valueRelevantExpMonthFormControlName.value),
      "isPreviouslyWorkedinBGSW": this.f.workedPreviousYearFormControlName.value == 'Yes' ? true : false,
      "boschEmployeeNumber": this.f.boschEmployeeNumber.value,
      "lwDatBGSW": lwdBgswDate,
      "photoDocUrl": this.photoUploadFileName,
      "purchaseOrderDocUrl": this.purchaseOrderUploaddFileName,
      "louDocUrl": this.letterofUndertakingrUploadfileName,
      "bgvReportDocUrl": this.backgroundVerificationReportUploadfileName,
      "ispTrainingAckDocUrl": this.iSPTrainingUploadfileName,
      "parentOrgidcardDocUrl": this.parentOrgUploadfileName,
      "previouEmployeeExpDocUrl": this.releivingLetterUploadfileName,
      "ispCertificateDocUrl": this.ispSecurityUploadfileName,
      "declarationOfObligDocUrl": this.dOOUploadfileName,
      "loaDocUrl": this.loaUploadfileName,
      "statusID": statusId,
      "isISPtrainingCompleted": this.onOBSubmitFirstCheckboxVallue,
      "isBGVcompletedandPassed": this.onOBSubmitThirdCheckboxVallue,
      "isConfirmDeclaration": this.onOBSubmitSecondCheckboxVallue,
      "remark": this.onOBSubmitRemarksTextVallue,
      "createdBy": this.vendorName,
      "compnayCode": this.getElementData.company,
      "documentsModel": documentsModelArray     
    }

if (type == 'Submit' || type == 'Save Draft') {
    this.loaderService.setShowLoading();

    obj["gradeId"]= this.getElementData.gradeId ;
    obj["skillSetId"]=  this.getElementData.skillSetId ;
    obj["plantId"]=   this.f.subWorkLocation.value.plantId ;
    obj["firstApproverNtid"]= this.getElementData?.firstApproverNtid;
    obj["secondApproverNtid"]=  this.getElementData?.secondApproverNtid;
    obj["tpResourcePlanId"]=this.getElementData?.tpResourcePlanId;
    obj["techProposalId"]=this.getElementData?.techProposalId;
if(this.getElementData?.replacementOrder==true){
  obj["replacementOrder"]=true;
  obj["deboardingRequestID"]=this.getElementData?.deboardingRequestID;
}
else{
  obj["replacementOrder"]=false;
  obj["deboardingRequestID"]="";
}

    this.API.saveOnboardingPostApi(obj).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      this.showLoading = false;
      if (response && response.status == "success") {
        let obRequestID="";
        let splitData="";
        if (response && response.data) {
           splitData=response.data?.split(' ID:');
          obRequestID = splitData[0];
        }
        this.showHideVerifyEmailIDButton1=true;
        this.showHideVerifyEmailIDButton2=false;
        this.snackBar.open(showAlertSuccessMessage, 'Close', {
          duration: 4000,
        });
        if (statusId == 2) {

          let _createdOn = moment(new Date()).format('DD-MMM-yyyy');

          let _entityId: any = "";
          let _userProfile: any = "";
          if (this.userDetailsRoles == '/Vendors') {
            _entityId = '00000000-0000-0000-0000-000000000000'
          }
          else {
            _userProfile = StorageQuery.getUserProfile();
            _entityId = _userProfile.entityId;
          }
          let _sendMailObject = {
            featureCode: 'MasterData-Approval-Process',
            entityId: _entityId,
            to: this.getElementData?.firstApproverMailId ,
            cc: this.getElementData?.email,
            subject: 'ENRICO | Onboarding | ' + obRequestID + ' | Request Approval',
            paraInTemplate: {
              teamName: this.getElementData?.firstApproverName || 'All',
              mainText: 'Below Request is awaiting your approval.' + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + obRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> "+this.getElementData.vendorName+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + _getPathUrl + "/Onboarding?data=onboarding&getOnboardRequestID="+splitData[1]+" target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + _getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(this.onOBSubmitRemarksTextVallue) + "</td></tr></table>",
            }
          };
          this.createdForm.reset();
          if (this.userDetailsRoles == '/EnricoUsers') {
            this.API.sendMailOnboardingPost(_sendMailObject).subscribe((response: any) => {
              console.log("Mail sent successfully");
            }
            );
          }
          else {
            this.API.sendVendorMailinitiateOnboarding(_sendMailObject).subscribe((response: any) => {
              console.log("Mail sent successfully");
            }
            );
          }
          this.backTo();
        }
        else{
          this.backTo();
        }
      }
      else {
        this.snackBar.open("Something going wrong", 'Close', {
          duration: 3000,
        });
      }
    })
  }
  else if (type == 'Resubmit') {
    this.loaderService.setShowLoading();
    obj["resourceOBRequestID"]=this.getElementData.id
    obj["idSowjdDetails"]=this.resourceObSowjdOrderDetailData.idSowjdDetails;;
    obj["idVendorDetails"]=this.vendorDetailsData.idVendorDetails;
    obj["idResourceDetails"]= this.resourceObResourceDetailsData.idResourceDetails;
    obj["idEduWorkDetails"]=this.educationDetailsData.idEduWorkDetails ;

    this.API.getUpdateRequestOB(this.userDetailsRoles ,obj).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      this.showLoading = false;
      if (response && response.status == "success") {
        this.snackBar.open(showAlertSuccessMessage, 'Close', {
          duration: 4000,
        });
        this.showHideVerifyEmailIDButton1=true;
        this.showHideVerifyEmailIDButton2=false;
        if (statusId == 2) {
          let _createdOn = moment(new Date()).format('DD-MMM-yyyy');
          let _entityId: any = "";
          let _userProfile: any = "";
          if (this.userDetailsRoles == '/Vendors') {
            _entityId = '00000000-0000-0000-0000-000000000000'
          }
          else {
            _userProfile = StorageQuery.getUserProfile();
            _entityId = _userProfile.entityId;
          }
          let _sendMailObject = {
            featureCode: 'MasterData-Approval-Process',
            entityId: _entityId,
            to: this.onboardingFirstApproveList?.firstApproverEmail ,
            cc: this.vendorDetailsData?.vendorEmail ,
            subject: 'ENRICO | Onboarding | ' + this.getElementData.sowJdNumber + '| Request Approval',
            paraInTemplate: {
              teamName: this.getElementData?.firstApproverName || 'All',
              mainText: 'Below Request is awaiting your approval.' +  "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + this.getElementData.sowJdNumber +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> "+this.getElementData.vendorName+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + _getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + _getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(this.onOBSubmitRemarksTextVallue) + "</td></tr></table>",
            }
          };
          this.createdForm.reset();
          if (this.userDetailsRoles == '/EnricoUsers') {
            this.API.sendMailOnboardingPost(_sendMailObject).subscribe((response: any) => {
              console.log("Mail sent successfully");
            }
            );
          }
          else {
            this.API.sendVendorMailinitiateOnboarding(_sendMailObject).subscribe((response: any) => {
              console.log("Mail sent successfully");
            }
            );
          }
          this.backTo();
        }
        else{
          this.backTo();
        }
      }
      else {
        this.snackBar.open("Something going wrong", 'Close', {
          duration: 3000,
        });
      }
    })
  }


  }
  backTo() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": encodeURIComponent('resourcePlan'),
      }
    };

    this.router.navigate(["Resource-Management"], navigationExtras);
    localStorage.removeItem('deBoardIDForStatus');
  }
  onOBSubmitFirstCheckboxVallue: any = false;
  onOBSubmitSecondCheckboxVallue: any = false;
  onOBSubmitThirdCheckboxVallue: any = false;
  onOBSubmitRemarksTextVallue: any = false;
  submitDialog(type: any) {
    if (this.verifiedOtp == false) {
      this.snackBar.open("Official email not verfied with verification code. Please Verify official email with verification code.", 'Close', {
        duration: 5000,
      });
      return;
    }
    else if (this.verifiedOtp == true) {
      if (this.f.officialEmailID.value && this.f.personalEmailID.value && (this.f.officialEmailID.value == this.f.personalEmailID.value)) {
        this.snackBar.open("Please Enter Official Email ID and Personal Email Different.", 'Close', {
          duration: 5000,
        });
        return;
      }


      if (this.f.sscYearPassing.value && this.f.hqYearPassing.value && (this.f.sscYearPassing.value >= this.f.hqYearPassing.value)) {
        this.snackBar.open("Please Select correct Passing Year of SSC and Highest Qualification", 'Close', {
          duration: 5000,
        });
        return;
      }

      let element = this.getElementData;
      let _obj = {
        rowData: element,
        type: type,
        checkButtonType:this.editSubmit
      };
      const dialogRef = this.dialog.open(SubmitOnboardingRequestDialogComponent, {
        width: '680px',
        maxHeight: '99vh',
        disableClose: true,
        data: _obj
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.ngOnInit();
        if (result && result.data && result.data.dialogtext == "true") {
          this.loaderService.setShowLoading();
          if (type == 'Submit') {
            this.onOBSubmitFirstCheckboxVallue = result.data.isBGVcompletedandPassed;
            this.onOBSubmitSecondCheckboxVallue = result.data.isConfirmDeclaration;
            this.onOBSubmitThirdCheckboxVallue = result.data.isISPtrainingCompleted;
          }
          else if (type == 'Resubmit' && result.data.btnStbmitType !='EDIT') {
            this.onOBSubmitFirstCheckboxVallue = false;
            this.onOBSubmitSecondCheckboxVallue = false;
            this.onOBSubmitThirdCheckboxVallue = false;
          }
          else if (type == 'Resubmit' && result.data.btnStbmitType =='EDIT') {
            this.onOBSubmitFirstCheckboxVallue = result.data.isBGVcompletedandPassed;
            this.onOBSubmitSecondCheckboxVallue = result.data.isConfirmDeclaration;
            this.onOBSubmitThirdCheckboxVallue = result.data.isISPtrainingCompleted;
          }
          this.onOBSubmitRemarksTextVallue = result.data.remark;
          this.saveButton(type)
        }
        else {
          this.loaderService.setShowLoading();
          this.onOBSubmitFirstCheckboxVallue = false;
          this.onOBSubmitSecondCheckboxVallue = false;
          this.onOBSubmitThirdCheckboxVallue = false;
          this.onOBSubmitRemarksTextVallue = "";
        }
      });
    }
  }


  radioChangeWorkedPastYear($event: MatRadioChange) {
    if ($event.value === 'Yes') {
      // this.createdForm.controls['boschEmployeeNumber'].setValidators([Validators.required]);
      // this.createdForm.controls['lwdBgsw'].setValidators([Validators.required]);
      this.createdForm.controls['boschEmployeeNumber'].setValidators(null);
      this.createdForm.controls['lwdBgsw'].setValidators(null);
    }
    else if ($event.value === 'No') {
      this.createdForm.patchValue({ 'boschEmployeeNumber': null });
      this.createdForm.patchValue({ 'lwdBgsw': null });
      this.createdForm.controls['boschEmployeeNumber'].setValidators(null);
      this.createdForm.controls['lwdBgsw'].setValidators(null);
    }
    this.createdForm.controls['boschEmployeeNumber'].updateValueAndValidity();
    this.createdForm.controls['lwdBgsw'].updateValueAndValidity();
  }



  billableOptionChange($event: any) {
    this.createdForm.patchValue({ 'billableStartDate': '' });
    if ($event.value == 'True') {
      this.createdForm.controls['billableStartDate'].setValidators([Validators.required]);
    }
    else if ($event.value == 'False') {
      this.createdForm.patchValue({ 'billableStartDate': null });
      this.createdForm.controls['billableStartDate'].setValidators(null);
    }
    this.createdForm.controls['billableStartDate'].updateValueAndValidity();
  }

  showHideContractDiv:boolean=false;
  resourceTypeChange($event: any) {
    this.showHideContractDiv=false;
    if ($event.value === 'Contract') {
      this.showHideContractDiv=true;
      this.createdForm.controls['registeredNameSubContractor'].setValidators([Validators.required]);
      this.createdForm.controls['domainIdSubContractor'].setValidators([Validators.required]);
      this.createdForm.controls['msaUploadFileFormControlName'].setValidators([Validators.required]);
    }

    else if ($event.value === 'Direct') {
      this.createdForm.patchValue({ 'registeredNameSubContractor': null });
      this.createdForm.patchValue({ 'domainIdSubContractor': null });
      this.createdForm.patchValue({ 'msaUploadFileFormControlName': null });
      this.createdForm.controls['registeredNameSubContractor'].setValidators(null);
      this.createdForm.controls['domainIdSubContractor'].setValidators(null);
      this.createdForm.controls['msaUploadFileFormControlName'].setValidators(null);
    }
    this.createdForm.controls['registeredNameSubContractor'].updateValueAndValidity();
    this.createdForm.controls['domainIdSubContractor'].updateValueAndValidity();
    this.createdForm.controls['msaUploadFileFormControlName'].updateValueAndValidity();
    this.msaUploadFileName = '';
    this.createdForm.patchValue({ 'msaUploadFileFormControlName': null });
  }

  showResidencePermanentAddress(event: MatCheckboxChange) {
    let houseStreet = this.createdForm.controls.residenceAddressHouseStreetNumber.value;
    let landmark = this.createdForm.controls.residenceAddressLandmark.value;
    let city = this.createdForm.controls.residenceAddressCity.value;
    let state = this.createdForm.controls.residenceAddressState.value;
    let postalCode = this.createdForm.controls.residenceAddressPostalCode.value;

    if (event && event.checked == true) {
      this.createdForm.patchValue({ 'permanentAddressHouseStreet': houseStreet });
      this.createdForm.patchValue({ 'permanentAddressLandmark': landmark });
      this.createdForm.patchValue({ 'permanentAddressCity': city });
      this.createdForm.patchValue({ 'permanentAddressState': state });
      this.createdForm.patchValue({ 'permanentAddressPostalCode': postalCode });

      this.createdForm.controls['permanentAddressHouseStreet'].disable();
      this.createdForm.controls['permanentAddressLandmark'].disable();
      this.createdForm.controls['permanentAddressCity'].disable();
      this.createdForm.controls['permanentAddressState'].disable();
      this.createdForm.controls['permanentAddressPostalCode'].disable();

    }
    else if (event && event.checked == false) {
      this.createdForm.patchValue({ 'permanentAddressHouseStreet': '' });
      this.createdForm.patchValue({ 'permanentAddressLandmark': '' });
      this.createdForm.patchValue({ 'permanentAddressCity': '' });
      this.createdForm.patchValue({ 'permanentAddressState': '' });
      this.createdForm.patchValue({ 'permanentAddressPostalCode': '' });

      this.createdForm.controls['permanentAddressHouseStreet'].enable();
      this.createdForm.controls['permanentAddressLandmark'].enable();
      this.createdForm.controls['permanentAddressCity'].enable();
      this.createdForm.controls['permanentAddressState'].enable();
      this.createdForm.controls['permanentAddressPostalCode'].enable();
    }

  }

  isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
  onTextPaste(e) {
    e.preventDefault();
  }
  validateOnlyAlphabet(event) {
    var inputValue = event.charCode;
    if (!((event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)) && (inputValue != 32 && inputValue != 0)) {
      event.preventDefault();
    }
  }
  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  }

   getExpectedDOJ() {   
      let newDate = new Date();
      newDate.setDate(newDate.getDate() +14);
      this.todayDateShowAfterSeven=newDate;
  
  //   let obj = {
  //     "companyCode": '6520',
  //     "location": "6527"
  //   }
  //   this.API.getNoOfHolidays(obj).subscribe((res: any) => {
  //     this.showLoading = false;
  //     if (res && res.status == "success") {
  //       let _numHoliday = 0;
  //       if (res && res.data && res.data.dbnoofHoliday) {
  //         _numHoliday = res.data.dbnoofHoliday[0].noOfHoliday;
  //         let startDate: any = new Date();
  //         let endDate: any = "";
  //         let offset = 6 + Number(_numHoliday);
  //         while (offset > 0) {
  //           endDate = new Date(startDate.setDate(startDate.getDate() + 1));
  //           if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
  //             offset--;
  //           }
  //         }
  //         this.expectedDOJDate = new Date(endDate);
  //       }
  //     }
  //   });
  }
  getNamtionaltyListOB() {
    this.API.getNamtionaltyListOB().subscribe((res: any) => {
      this.nationalityListRecords = res;
      this.nationalityListData = res.slice();
    })
  }
  getstdCountryCode() {
    this.API.getStdCountryListOB().subscribe((res: any) => {
      this.stdCodeListRecordsprimary = res;
      this.stdCodeListDataPrimary = res.slice();
      this.stdCodeListRecordsAlternate = res;
      this.stdCodeListDataAlternate = res.slice();
      this.stdCodeListRecordsEmergency = res;
      this.stdCodeListDataEmergency = res.slice();
    })
  }
  allowNumbersAndDot(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    var value = event.target.value;
    if (charCode == 46 && value.indexOf('.') > -1) {
      return false;
    }
    return true;
  }
  generateOTPValue: any = "";
  otpSentFlag: boolean = false;
  verifiedOtp: boolean = false;
  clickVerifyEmailButton() {
    this.createdForm.controls['officialEmailID'].enable();
    this.createdForm.controls['domainIdSubContractor'].enable();
    this.verifiedOtp = false;
    this.otpSentFlag = false;
    let officialWmailID = this.createdForm.controls['officialEmailID'].value;
    var filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(officialWmailID)) {
      this.snackBar.open("Please enter a valid official email address", 'Close', {
        duration: 4000,
      });
      return false;
    }
    this.loaderService.setShowLoading();
this.API.getCheckExitEmailOB(officialWmailID).subscribe((res:any)=>{
  this.loaderService.setDisableLoading();
  if(res && res.data && res.data==true){

   // this.commonCheckDomainMatch();
    this.generateOTPValue = this.generateOTP();
    let _entityId: any = "";
    let _userProfile: any = "";
    if (this.userDetailsRoles == '/Vendors') {
      _entityId = '00000000-0000-0000-0000-000000000000'
    }
    else {
      _userProfile = StorageQuery.getUserProfile();
      _entityId = _userProfile.entityId;
    }

    let _sendMailObject = {
      featureCode: 'MasterData-Approval-Process',
      to: officialWmailID,
      entityId: _entityId,
      subject: 'ENRICO | Onboarding | Verify Email ID',
      paraInTemplate: {
        teamName: 'Team',
        mainText: 'Please enter verification code in onboading form.' + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Verification Code: </b></td> <td>" + this.generateOTPValue + "</td></tr></table>",

      }
    };

    this.loaderService.setShowLoading();
    if (this.userDetailsRoles == '/EnricoUsers') {
      this.API.sendMailOnboardingPost(_sendMailObject).subscribe((response: any) => {
        this.snackBar.open("verification code has sent succeessfully, Please check in your official email", 'Close', {
          duration: 4000,
        });
        this.otpSentFlag = true;
        this.loaderService.setDisableLoading();
        this.timer(120);
        this.showHideVerifyEmailIDButton1=false;
        this.showHideVerifyEmailIDButton2=false;
      }
      );
    }
    else {
      this.API.sendVendorMailinitiateOnboarding(_sendMailObject).subscribe((response: any) => {
        this.snackBar.open("verification code has sent succeessfully, Please check in your official email", 'Close', {
          duration: 4000,
        });
        this.otpSentFlag = true;
        this.loaderService.setDisableLoading();
        this.showHideVerifyEmailIDButton1=false;
        this.showHideVerifyEmailIDButton2=false;
        this.timer(120);
      }

      );
    }
  }
  else{
    this.snackBar.open("This Email ID is mapped with another resource*", 'Close', {
      duration: 4000,
    });
    this.createdForm.patchValue({ 'officialEmailID': '' });
    return;
  }

  })


  }
  showHideVerifyEmailIDButton1:boolean=true;
  showHideVerifyEmailIDButton2:boolean=false;
  generateOTP() {
    let digits = '0123456789';
    let OTP = '';
    let len = digits.length
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return OTP;
  }
  clickConfirmOtpButton() {
    let otpVal = this.createdForm.controls.otpValueFormControlName.value;
    if (this.generateOTPValue == otpVal) {
      this.snackBar.open("verification code Verified Successfully", 'Close', {
        duration: 4000,
      });
      this.createdForm.patchValue({ 'otpValueFormControlName': '' });
      this.otpSentFlag = false;
      this.verifiedOtp = true;
      this.createdForm.controls['officialEmailID'].disable();
    }
    else {
      this.verifiedOtp = false;
      this.snackBar.open("Please enter correct verification code", 'Close', {
        duration: 4000,
      });
      this.otpSentFlag = true;
      this.createdForm.controls['officialEmailID'].enable();
      return;
    }
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.createdForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid)
    return invalid;
}
reSubmitDialogOpen(type: any){
  let msa1=this.msaUploadFileName;
  let poa1=this.proofAdressUploadFileName;
  let ssc1=this.sscEducationUploadFileName;
  let hq1=this.highestEducationUploadFileName;
  let photo1 = this.photoUploadFileName;
  let po1 = this.purchaseOrderUploaddFileName;
  let lou1 = this.letterofUndertakingrUploadfileName;
  let bvr1 = this.backgroundVerificationReportUploadfileName;
  let ispTraining1 = this.iSPTrainingUploadfileName;
  let parentOrg1 = this.parentOrgUploadfileName;
  let reliving1 = this.releivingLetterUploadfileName;
  let ispCertificate1 = this.ispSecurityUploadfileName;
  let doo1 = this.dOOUploadfileName;
  let loa1 = this.loaUploadfileName;
  if((msa1=="" || msa1==null || msa1==undefined)  && (this.createdForm.controls.resourceType.value=='Contract')){
    this.snackBar.open("Please Upload Master Service Agreement (MSA) Scope Extension *", 'Close', {
      duration: 5000,
    });
    return;
  }
  if(poa1=="" || poa1==null || poa1==undefined){
    this.snackBar.open("Please Upload Proof of Address *", 'Close', {
      duration: 3000,
    });
    return;
  }
  if(ssc1=="" || ssc1==null || ssc1==undefined){
    this.snackBar.open("Please Upload SSC/10th Education Details *", 'Close', {
      duration: 3000,
    });
    return;
  }
  if((hq1=="" || hq1==null || hq1==undefined)  && this.salaryLevelStatus=='Level 83'){
    this.snackBar.open("Please Upload Highest Qualification Details *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(photo1=="" || photo1==null || photo1==undefined){
    this.snackBar.open("Please Upload Photo *", 'Close', {
      duration: 3000,
    });
    return;
  }
  if(po1=="" || po1==null || po1==undefined){
    this.snackBar.open("Please Upload Purchase Order *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(lou1=="" || lou1==null || lou1==undefined){
    this.snackBar.open("Please Upload Letter of Undertaking *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(bvr1=="" || bvr1==null || bvr1==undefined){
    this.snackBar.open("Please Upload Background Verification Report *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(ispTraining1=="" || ispTraining1==null || ispTraining1==undefined){
    this.snackBar.open("Please Upload Information Security Policy (ISP) Training Acknowlegement *", 'Close', {
      duration: 5000,
    });
    return;
  }
  if(parentOrg1=="" || parentOrg1==null || parentOrg1==undefined){
    this.snackBar.open("Please Upload Parent Organization ID Card *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(doo1=="" || doo1==null || doo1==undefined){
    this.snackBar.open("Please Upload Declaration of Obligation (DOO) *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if(ispCertificate1=="" || ispCertificate1==null || ispCertificate1==undefined){
    this.snackBar.open("Please Upload Information Security Policy (ISP) Certificate *", 'Close', {
      duration: 4000,
    });
    return;
  }
  if((reliving1=="" || reliving1==null || reliving1==undefined) && this.salaryLevelStatus=='Level 83'){
    this.snackBar.open("Please Upload Previous Employer Experience/Relieving Letter *", 'Close', {
      duration: 5000,
    });
    return;
  }
  if((loa1=="" || loa1==null || loa1==undefined)  && this.salaryLevelStatus=='Level 83'){
    this.snackBar.open("Please Upload Letter of Authorization (LOA) *", 'Close', {
      duration: 4000,
    });
    return;
  }
      this.submitDialog(type);
     // alert("As of now , Not Done For Resubmit")
    }
   
    minBillingDateShow: any = new Date();
    addExpectedDojChangeEvent(event: MatDatepickerInputEvent<Date>) {
      this.createdForm.patchValue({ 'billableStartDate': '' });
      this.minBillingDateShow=event.value;
    }


    checkDomainSubContractor(){ 
      let ofcialValueEmail=  this.createdForm.controls['officialEmailID'].value;   
      let splitOfcialValueEmail= ofcialValueEmail?.split('@')[1];
      let checkOfficialEmailDomain= '@'+splitOfcialValueEmail;
       let  domainSubContarctorValue = this.createdForm.controls.domainIdSubContractor.value;;
       if(checkOfficialEmailDomain !=domainSubContarctorValue){
        this.snackBar.open("Official email domain and Domain Sub contractor Both Should be Same.*", 'Close', {
          duration: 5000,
        });
         this.createdForm.patchValue({ 'officialEmailID': '' });
       }
       this.createdForm.patchValue({ 'otpValueFormControlName': '' });
       this.otpSentFlag = false;
       this.verifiedOtp = false;
       return;
     
    }



    checkDomainOfficialEmail(){
      let ofcialValueEmail=  this.createdForm.controls['officialEmailID'].value;
if(this.createdForm.controls.resourceType.value=='Direct'){

 let splitOfcialValueEmail= ofcialValueEmail?.split('@')[1];
 let checkOfficialEmailDomain= '@'+splitOfcialValueEmail;
  let parentGetelementDomailId=this.getElementData?.domainID;
  if(checkOfficialEmailDomain !=parentGetelementDomailId){
    this.snackBar.open("Please Enter Correct Official Email Domain ID*", 'Close', {
      duration: 5000,
    });
    this.createdForm.patchValue({ 'officialEmailID': '' });
  }
  return;
}
else if(this.createdForm.controls.resourceType.value=='Contract'){
  this.commonCheckDomainMatch();
  this.otpSentFlag = false;
  this.verifiedOtp = false;
}
    }
    commonCheckDomainMatch(){
      let ofcialValueEmail=  this.createdForm.controls['officialEmailID'].value;
      var domainSubContarctorValue = this.createdForm.controls.domainIdSubContractor.value;//'somethingelse.com';
      var testValue = "@" + domainSubContarctorValue.toLowerCase();
      if(ofcialValueEmail.substr(ofcialValueEmail.length - testValue.length).toLowerCase() != testValue && ofcialValueEmail.length >0 ) {      
       this.snackBar.open("Official email domain and Domain Sub contractor Both Should be Same.*", 'Close', {
        duration: 5000,
      });
       this.createdForm.patchValue({ 'officialEmailID': '' });
       return;
      }
    }

    disabledFirstLevelFunction(){
      this.createdForm.controls['subWorkLocation'].disable();
      this.createdForm.controls['poLineItem'].disable();
       this.createdForm.controls['expectedDoj'].disable();
       this.createdForm.controls['billable'].disable();
       this.createdForm.controls['billableStartDate'].disable();
    }
    enabledFirstLevelFunction(){
      this.createdForm.controls['subWorkLocation'].enable();
      this.createdForm.controls['poLineItem'].enable();
      this.createdForm.controls['expectedDoj'].enable();
      this.createdForm.controls['billable'].enable();
      this.createdForm.controls['billableStartDate'].enable();
    }
    disabledSecondLevelFunction(){
      this.showHideContractDiv=false;
      this.createdForm.controls['resourceType'].disable();
       if(this.createdForm.controls['resourceType'].value=='Contract'){      
        this.createdForm.controls['registeredNameSubContractor'].disable();
        this.createdForm.controls['domainIdSubContractor'].disable();
        this.showHideContractDiv=true;
       }
     
       this.createdForm.controls['personalInfoTitle'].disable();
       this.createdForm.controls['personalInfoFirstName'].disable();
       this.createdForm.controls['personalInfoMiddleName'].disable();
       this.createdForm.controls['personalInfoLastName'].disable();
       this.createdForm.controls['personalInfoLastDOB'].disable();
       this.createdForm.controls['personalInfoGender'].disable();
       this.createdForm.controls['personalInfoNationality'].disable();
       this.createdForm.controls['officialEmailID'].disable();
       this.createdForm.controls['personalEmailID'].disable();
       this.createdForm.controls['primaryCountryMobileCode'].disable();
       this.createdForm.controls['primaryContactNumber'].disable();
       this.createdForm.controls['alternateCountryMobileCode'].disable();
       this.createdForm.controls['alternateContactNumber'].disable();
       this.createdForm.controls['emergencyContactName'].disable();
       this.createdForm.controls['emergencyContactMobileCode'].disable();
       this.createdForm.controls['emergencyContactMobileNumber'].disable();
       this.createdForm.controls['idType'].disable();
       this.createdForm.controls['idNumber'].disable();
       this.createdForm.controls['proofIDType'].disable();
       this.createdForm.controls['residenceAddressHouseStreetNumber'].disable();
       this.createdForm.controls['residenceAddressLandmark'].disable();
       this.createdForm.controls['residenceAddressCity'].disable();
       this.createdForm.controls['residenceAddressState'].disable();
       this.createdForm.controls['residenceAddressPostalCode'].disable();
       this.createdForm.controls['residenceAddressCheckBox'].disable();
       this.createdForm.controls['permanentAddressHouseStreet'].disable();
       this.createdForm.controls['permanentAddressLandmark'].disable();
       this.createdForm.controls['permanentAddressCity'].disable();
       this.createdForm.controls['permanentAddressState'].disable();
       this.createdForm.controls['permanentAddressPostalCode'].disable();
       this.createdForm.controls['sscBoard'].disable();
       this.createdForm.controls['sscInstitution'].disable();
       this.createdForm.controls['sscYearPassing'].disable();
       this.createdForm.controls['sscPercentage'].disable();
       this.createdForm.controls['sscMode'].disable();
       this.createdForm.controls['sscUploadFileFormControlName'].disable();
       this.createdForm.controls['highestQualification'].disable();
       this.createdForm.controls['hqSpecialization'].disable();
       this.createdForm.controls['hqInstitution'].disable();
       this.createdForm.controls['hqYearPassing'].disable();
       this.createdForm.controls['hqPercentage'].disable();
       this.createdForm.controls['hqMode'].disable();

       this.createdForm.controls['workedPreviousYearFormControlName'].disable();
        this.createdForm.controls['boschEmployeeNumber'].disable();
        this.createdForm.controls['lwdBgsw'].disable();


    } 
    enabledSecondLevelFunction(){
      this.createdForm.controls['resourceType'].enable();
      this.createdForm.controls['registeredNameSubContractor'].enable();
      this.createdForm.controls['domainIdSubContractor'].enable();
      this.createdForm.controls['personalInfoTitle'].enable();
      this.createdForm.controls['personalInfoFirstName'].enable();
      this.createdForm.controls['personalInfoMiddleName'].enable();
      this.createdForm.controls['personalInfoLastName'].enable();
      this.createdForm.controls['personalInfoLastDOB'].enable();
      this.createdForm.controls['personalInfoGender'].enable();
      this.createdForm.controls['personalInfoNationality'].enable();
      this.createdForm.controls['officialEmailID'].enable();
      this.createdForm.controls['personalEmailID'].enable();
      this.createdForm.controls['primaryCountryMobileCode'].enable();
      this.createdForm.controls['primaryContactNumber'].enable();
      this.createdForm.controls['alternateCountryMobileCode'].enable();
      this.createdForm.controls['alternateContactNumber'].enable();
      this.createdForm.controls['emergencyContactName'].enable();
      this.createdForm.controls['emergencyContactMobileCode'].enable();
      this.createdForm.controls['emergencyContactMobileNumber'].enable();
      this.createdForm.controls['idType'].enable();
      this.createdForm.controls['idNumber'].enable();
      this.createdForm.controls['proofIDType'].enable();
      this.createdForm.controls['residenceAddressHouseStreetNumber'].enable();
      this.createdForm.controls['residenceAddressLandmark'].enable();
      this.createdForm.controls['residenceAddressCity'].enable();
      this.createdForm.controls['residenceAddressState'].enable();
      this.createdForm.controls['residenceAddressPostalCode'].enable();
      this.createdForm.controls['residenceAddressCheckBox'].enable();
      this.createdForm.controls['permanentAddressHouseStreet'].enable();
      this.createdForm.controls['permanentAddressLandmark'].enable();
      this.createdForm.controls['permanentAddressCity'].enable();
      this.createdForm.controls['permanentAddressState'].enable();
      this.createdForm.controls['permanentAddressPostalCode'].enable();
      this.createdForm.controls['sscBoard'].enable();
      this.createdForm.controls['sscInstitution'].enable();
      this.createdForm.controls['sscYearPassing'].enable();
      this.createdForm.controls['sscPercentage'].enable();
      this.createdForm.controls['sscMode'].enable();
      this.createdForm.controls['sscUploadFileFormControlName'].enable();
      this.createdForm.controls['highestQualification'].enable();
      this.createdForm.controls['hqSpecialization'].enable();
      this.createdForm.controls['hqInstitution'].enable();
      this.createdForm.controls['hqYearPassing'].enable();
      this.createdForm.controls['hqPercentage'].enable();
      this.createdForm.controls['hqMode'].enable();
      this.createdForm.controls['workedPreviousYearFormControlName'].enable();
      this.createdForm.controls['boschEmployeeNumber'].enable();
      this.createdForm.controls['lwdBgsw'].enable();
    }
    msavendorClickDownload() {
      let fileURL = this.vendorMSAFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.vendorMSAFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    proofAddressClickDownload() {
      let fileURL = this.addressProofFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.addressProofFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    sscClickDownload() {
      let fileURL = this.sscDocumnetFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.sscDocumnetFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    highestQualClickDownload() {
      let fileURL = this.highestDocumentFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.highestDocumentFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    photoClickDownload() {
      let fileURL = this.photoDocumentFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.photoDocumentFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    purchaseOrderClickDownload() {
      let fileURL = this.purchaseOrderFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.purchaseOrderFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
  
    louClickDownload() {
      let fileURL = this.louFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.louFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
  
    bvreportClickDownload() {
      let fileURL = this.bgvReportFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.bgvReportFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    ispTrainingClickDownload() {
      let fileURL = this.ispTrainingFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.ispTrainingFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
  
    parentOrgClickDownload() {
      let fileURL = this.parentOrgFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.parentOrgFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    releivingClickDownload() {
      let fileURL = this.relievingDocumentFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.relievingDocumentFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
  
    ispCertificateClickDownload() {
      let fileURL = this.ispCertificateFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.ispCertificateFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
  
    dooClickDownload() {
      let fileURL = this.dooFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.dooFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    loaClickDownload() {
      let fileURL = this.loaFileGet.documentURL + '?' + this.forDownloadSSNtoken;
      let fileName = this.loaFileGet.documentName;
      this.downloadFileMethod(fileURL, fileName);
    }
    downloadFileMethod(fileURL, fileName) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.setAttribute('href', fileURL);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
    getRemarkTextparagrapg(remarksValue:any){
      return remarksValue.replace('FirstRejectedButtonOB:',' ').replace('SecondRejectedButtonOB:',' ').replace('SubmitRemarksFirstOBs:',' ').replace('ReSubmitRemarksSecondOBs:',' ')
    }


 timerOn:boolean = true;
 setTimerCount:any;
 timer(remaining) {
  let m:any = Math.floor(remaining / 60);
  let s:any = remaining % 60;  
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  this.setTimerCount = m + ' minutes ' + s + ' seconds ';
  remaining -= 1;
  
  if(remaining >= 0 && this.timerOn) {
    setTimeout(()=> {
        this.timer(remaining);
    }, 1000);
    return;
  }

  if(!this.timerOn) {
    // Do validate stuff here
    return;
  }
  
  // Do timeout stuff here

  if(remaining == -1 &&  this.verifiedOtp == false){
    //alert(this.timerOn+'Timeout for otp');
  this.createdForm.patchValue({ 'otpValueFormControlName': '' });
  this.verifiedOtp = false;
  this.otpSentFlag = false;
  this.showHideVerifyEmailIDButton1=false;
  this.showHideVerifyEmailIDButton2=true;
  }
  else if(remaining == -1 &&  this.verifiedOtp == true){
    
  }
}
isNumberAndAlphabetKey(e:any){
  var regex = new RegExp("^[a-zA-Z0-9]+$");
  var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
  if (regex.test(str)) {
      return true;
  }
  e.preventDefault();
  return false;
}
changePercentageSSC(){
  if (this.f.sscPercentage.value < 0) {
    this.createdForm.patchValue({ 'sscPercentage': 0  });
  }
  if (this.f.sscPercentage.value > 100) {
    this.createdForm.patchValue({ 'sscPercentage': 100  });
  }
}
changePercentageHQ(){
  if (this.f.hqPercentage.value < 0) {
    this.createdForm.patchValue({ 'hqPercentage': 0  });
  }
  if (this.f.hqPercentage.value > 100) {
    this.createdForm.patchValue({ 'hqPercentage': 100  });
  }
}








vendorSectionDisabled(){
  this.showHideContractDiv=false;
  this.createdForm.controls['resourceType'].disable();
  if(this.createdForm.controls['resourceType'].value=='Contract'){
  
   this.createdForm.controls['registeredNameSubContractor'].disable();
   this.createdForm.controls['domainIdSubContractor'].disable();
   this.showHideContractDiv=true;
  }
}
vendorSectionEnabled(){
  this.createdForm.controls['resourceType'].enable();
      this.createdForm.controls['registeredNameSubContractor'].enable();
      this.createdForm.controls['domainIdSubContractor'].enable();
}

personalInformationDisabled(){
  this.createdForm.controls['personalInfoTitle'].disable();
  this.createdForm.controls['personalInfoFirstName'].disable();
  this.createdForm.controls['personalInfoMiddleName'].disable();
  this.createdForm.controls['personalInfoLastName'].disable();
  this.createdForm.controls['personalInfoLastDOB'].disable();
  this.createdForm.controls['personalInfoGender'].disable();
  this.createdForm.controls['personalInfoNationality'].disable();
}
personalInformationEnabled(){
  this.createdForm.controls['personalInfoTitle'].enable();
  this.createdForm.controls['personalInfoFirstName'].enable();
  this.createdForm.controls['personalInfoMiddleName'].enable();
  this.createdForm.controls['personalInfoLastName'].enable();
  this.createdForm.controls['personalInfoLastDOB'].enable();
  this.createdForm.controls['personalInfoGender'].enable();
  this.createdForm.controls['personalInfoNationality'].enable();
}

contactInfoDisabled(){
  this.createdForm.controls['personalEmailID'].disable();
  this.createdForm.controls['primaryCountryMobileCode'].disable();
  this.createdForm.controls['primaryContactNumber'].disable();
  this.createdForm.controls['alternateCountryMobileCode'].disable();
  this.createdForm.controls['alternateContactNumber'].disable();
  this.createdForm.controls['emergencyContactName'].disable();
  this.createdForm.controls['emergencyContactMobileCode'].disable();
  this.createdForm.controls['emergencyContactMobileNumber'].disable();
}
contactInfoEnabled(){
  this.createdForm.controls['personalEmailID'].enable();
  this.createdForm.controls['primaryCountryMobileCode'].enable();
  this.createdForm.controls['primaryContactNumber'].enable();
  this.createdForm.controls['alternateCountryMobileCode'].enable();
  this.createdForm.controls['alternateContactNumber'].enable();
  this.createdForm.controls['emergencyContactName'].enable();
  this.createdForm.controls['emergencyContactMobileCode'].enable();
  this.createdForm.controls['emergencyContactMobileNumber'].enable();
}

identityInformationDisabled(){
  this.createdForm.controls['idType'].disable();
  this.createdForm.controls['idNumber'].disable();
}
identityInformationEnabled(){
  this.createdForm.controls['idType'].enable();
  this.createdForm.controls['idNumber'].enable();
}

residenceAddressDisabled(){
  this.createdForm.controls['residenceAddressHouseStreetNumber'].disable();
  this.createdForm.controls['residenceAddressLandmark'].disable();
  this.createdForm.controls['residenceAddressCity'].disable();
  this.createdForm.controls['residenceAddressState'].disable();
  this.createdForm.controls['residenceAddressPostalCode'].disable();
  this.createdForm.controls['residenceAddressCheckBox'].disable();
  this.createdForm.controls['permanentAddressHouseStreet'].disable();
  this.createdForm.controls['permanentAddressLandmark'].disable();
  this.createdForm.controls['permanentAddressCity'].disable();
  this.createdForm.controls['permanentAddressState'].disable();
  this.createdForm.controls['permanentAddressPostalCode'].disable();
}
residenceAddressEnaabled(){
  this.createdForm.controls['residenceAddressHouseStreetNumber'].enable();
  this.createdForm.controls['residenceAddressLandmark'].enable();
  this.createdForm.controls['residenceAddressCity'].enable();
  this.createdForm.controls['residenceAddressState'].enable();
  this.createdForm.controls['residenceAddressPostalCode'].enable();
  this.createdForm.controls['residenceAddressCheckBox'].enable();
  this.createdForm.controls['permanentAddressHouseStreet'].enable();
  this.createdForm.controls['permanentAddressLandmark'].enable();
  this.createdForm.controls['permanentAddressCity'].enable();
  this.createdForm.controls['permanentAddressState'].enable();
  this.createdForm.controls['permanentAddressPostalCode'].enable();
}
sectionSSCDisabled(){
  this.createdForm.controls['sscBoard'].disable();
       this.createdForm.controls['sscInstitution'].disable();
       this.createdForm.controls['sscYearPassing'].disable();
       this.createdForm.controls['sscPercentage'].disable();
       this.createdForm.controls['sscMode'].disable();
       this.createdForm.controls['sscUploadFileFormControlName'].disable();
}
sectionSSCEnabled(){
  this.createdForm.controls['sscBoard'].enable();
  this.createdForm.controls['sscInstitution'].enable();
  this.createdForm.controls['sscYearPassing'].enable();
  this.createdForm.controls['sscPercentage'].enable();
  this.createdForm.controls['sscMode'].enable();
  this.createdForm.controls['sscUploadFileFormControlName'].enable();
}

sectionHQDisabled(){
  this.createdForm.controls['highestQualification'].disable();
       this.createdForm.controls['hqSpecialization'].disable();
       this.createdForm.controls['hqInstitution'].disable();
       this.createdForm.controls['hqYearPassing'].disable();
       this.createdForm.controls['hqPercentage'].disable();
       this.createdForm.controls['hqMode'].disable();
}
sectionHQEnabled(){
  this.createdForm.controls['highestQualification'].enable();
      this.createdForm.controls['hqSpecialization'].enable();
      this.createdForm.controls['hqInstitution'].enable();
      this.createdForm.controls['hqYearPassing'].enable();
      this.createdForm.controls['hqPercentage'].enable();
      this.createdForm.controls['hqMode'].enable();
}
}
