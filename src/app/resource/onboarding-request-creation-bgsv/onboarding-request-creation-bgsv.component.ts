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
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
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
  selector: 'app-onboarding-request-creation-bgsv.component',
  templateUrl: './onboarding-request-creation-bgsv.component.html',
  styleUrls: ['./onboarding-request-creation-bgsv.component.scss'],
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
export class OnboardingRequestCreationBgsvComponent implements OnInit {

  getElementData: any = [];
  createdForm: FormGroup;
  showLoading: boolean = false;
  todayDateShow: any = new Date();
  todayDateShowAfterSeven: any = new Date();
  expectedDOJDate: any = new Date();
  nationalityListRecords: any = [];
  nationalityListData: any = [];
  stdCodeListDataPrimary: any = [];
  stdCodeListDataAlternate: any = [];
  stdCodeListDataEmergency: any = [];
  salaryLevelStatus: any = "";
  vendorName: any = "";
  userDetailsRoles: any = [];
  remarksList: any = [];
  stdCodeListRecordsprimary: any = [];
  stdCodeListRecordsAlternate: any = [];
  stdCodeListRecordsEmergency: any = [];
  profileInformation: any = [];
  resourceObSowjdOrderDetailData: any = [];
  resourceObOrganizationDetailData: any = [];
  resourceObResourceDetailsData: any = [];
  educationDetailsData: any = [];
  vendorDetailsData: any = [];
  onboardingDetailsList: any = [];
  employeeMasterDetailsList: any = [];
  ntIDDetailsList: any = [];
  resourceCheckInDetailsList: any = [];
  resourceIDcardIsuueDetailsList: any = [];
  resourceShareNtidDetailsList: any = [];
  onboardingBGVList: any = [];
  bgvCompletedDetailsList: any = [];
  bgvRequestDetailsList: any = [];
  bgvInitiateDetailsList: any = [];
  onboardingUploadFileList: any = [];
  photoDocumentFileGet: any = [];
  parentOrgFileGet: any = [];
  ispCertificateFileGet: any = [];
  iClikedEditButton: boolean = false;
  editSubmit: any = "";
  workLocationList: any = [];
  maxDateOfBirth: Date;
  minDateOfBirth:Date;
  poLineItemsList: any = [];
  getElementDataSignOff: any = "";
  getElementDataLocation: any = "";
  sowJdSectionFilter: any = [];
  organizationSectionFilter: any = [];
  vendorSectionFilter: any = [];
  personalInfoSectionFilter: any = [];
  contactInformationSectionFilter: any = [];
  identityInformationSectionFilter: any = [];
  residenceSectionSectionFilter: any = [];
  workExperienceSectionFilter: any = [];
  previousWorkedSectionFilter: any = [];
  photoSectionFilter: any = [];
  parentOrgSectionFilter: any = [];
  ispCertificateSectionFilter: any = [];
  checkCompanyCodeGlobalData:any;
  constructor(private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private API: ApiResourceService, private fb: FormBuilder, private snackBar: MatSnackBar, public loaderService: LoaderService) {
    this.createdForm = this.fb.group({
      subWorkLocation: ['', Validators.required],
      poLineItem: ['', Validators.required],
      expectedDoj: ['', Validators.required],
      billable: ['', Validators.required],
      billableStartDate: [''],
      personalInfoTitle: ['', Validators.required],
      personalInfoFirstName: ['', Validators.required],
      personalInfoMiddleName: [''],
      personalInfoLastName: ['', Validators.required],
      personalInfoLastDOB: ['', Validators.required],
      personalInfoGender: ['', Validators.required],
      personalInfoNationality: ['', Validators.required],
      officialEmailID: ['', [Validators.required, Validators.email,]],///^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
      otpValueFormControlName: [''],
      primaryCountryMobileCode: ['', Validators.required],
      primaryContactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      alternateCountryMobileCode: ['',],
      alternateContactNumber: ['', [Validators.minLength(10)]],
      emergencyContactName: ['', Validators.required],
      emergencyContactMobileCode: ['', Validators.required],
      emergencyContactMobileNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      idType: ['', Validators.required],
      idNumber: ['', [Validators.required, Validators.minLength(12)]],
      residenceAddressHouseStreetNumber: ['', Validators.required],
      residenceAddressLandmark: ['', Validators.required],
      residenceAddressCity: ['', Validators.required],
      residenceAddressState: ['', Validators.required],
      residenceAddressPostalCode: ['', [Validators.required, Validators.minLength(6)]],
      residenceAddressCheckBox: [false],
      permanentAddressHouseStreet: ['', Validators.required],
      permanentAddressLandmark: ['', Validators.required],
      permanentAddressCity: ['', Validators.required],
      permanentAddressState: ['', Validators.required],
      permanentAddressPostalCode: ['', [Validators.required, Validators.minLength(6)]],
      valueTotalExpYearFormControlName: [0],
      valueTotalExpMonthFormControlName: [0],
      valueRelevantExpYearFormControlName: [0],
      valueRelevantExpMonthFormControlName: [0],
      workedPreviousYearFormControlName: ['', Validators.required],
      boschEmployeeNumber: [''],
      lwdBgsw: [''],
      photoUploadFileFormControlName: ['', Validators.required],
      parentOrgUploadFileFormControlName: ['', Validators.required],
      ispSecurityUploadFileFormControlName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.maxDateOfBirth = new Date();
    this.maxDateOfBirth.setMonth(this.maxDateOfBirth.getMonth() - 12 * 18);
    this.minDateOfBirth = new Date();
    this.minDateOfBirth.setMonth(this.minDateOfBirth.getMonth() - 12 * 60);
    this.iClikedEditButton = false;
    this.editSubmit = "";
    this.createdForm.controls['officialEmailID'].enable();
    this.route.queryParams.subscribe(params => {
      this.getElementData = JSON.parse(params.element);
      this.getElementDataSignOff = this.getElementData.technicalProposalNumber;
      this.getElementDataLocation = this.getElementData.personalArea;
      this.checkCompanyCodeGlobalData=params?.checkCompanyCodeGlobal;
      debugger;
      if (params && params.draftEditOption == "EDIT") {
        this.iClikedEditButton = true;
        this.editSubmit = params.draftEditOption;
        this.getDetailsInformation(params);
        this.getElementDataSignOff = "";
        this.getElementDataSignOff = params.signOffId;
        this.getElementDataLocation = "";
        this.getElementDataLocation = this.getElementData.personalArea;
      }
      if (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack")) {
        this.iClikedEditButton = true;
        this.getDetailsInformation(params);
        this.verifiedOtp = true;
        this.createdForm.controls['officialEmailID'].disable();
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

  
    let _getLoginDetails = this.API.getFetchLoginDetailsFor()
    this.vendorName = _getLoginDetails.profile.name;
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    this.profileInformation = _getLoginDetails.profile;
    this.createdForm.controls['alternateContactNumber'].valueChanges.subscribe(c => {
      let pc = this.createdForm.controls.primaryContactNumber.value;
      if ((pc == c) && (pc.length == c.length) && pc.length > 0 && c.length > 0) {
        this.snackBar.open("Primary contact number and Alternate contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'alternateContactNumber': '' });
      }
      let ac = this.createdForm.controls.alternateContactNumber.value;
      if (ac == 0 && ac.length == undefined) {
        this.createdForm.patchValue({ 'alternateContactNumber': '' });
      }
      if (pc == 0 && pc.length == undefined) {
        this.createdForm.patchValue({ 'primaryContactNumber': '' });
      }

    });
    this.createdForm.controls['emergencyContactMobileNumber'].valueChanges.subscribe(c => {
      let pc = this.createdForm.controls.primaryContactNumber.value;
      let ac = this.createdForm.controls.alternateContactNumber.value;
      if ((pc == c) && (pc.length == c.length) && pc.length > 0 && c.length > 0) {
        this.snackBar.open("Primary contact number and Emergency contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'emergencyContactMobileNumber': '' });
      }
      if ((ac == c) && (ac.length == c.length) && ac.length > 0 && c.length > 0) {
        this.snackBar.open("Alternate contact number and Emergency contact number should be different.", 'Close', {
          duration: 5000,
        });
        this.createdForm.patchValue({ 'emergencyContactMobileNumber': '' });
      }
      let ec = this.createdForm.controls.emergencyContactMobileNumber.value;
      if (ec == 0 && ec.length == undefined) {
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
      if (this.createdForm.controls['residenceAddressCheckBox'].value == true) {
        let houseStreet = this.createdForm.controls.residenceAddressHouseStreetNumber.value;
        this.createdForm.patchValue({ 'permanentAddressHouseStreet': houseStreet });
      }
    })

    this.createdForm.controls['residenceAddressLandmark'].valueChanges.subscribe(c => {
      if (this.createdForm.controls['residenceAddressCheckBox'].value == true) {
        let addressRes = this.createdForm.controls.residenceAddressLandmark.value;
        this.createdForm.patchValue({ 'permanentAddressLandmark': addressRes });
      }
    })
    this.createdForm.controls['residenceAddressCity'].valueChanges.subscribe(c => {
      if (this.createdForm.controls['residenceAddressCheckBox'].value == true) {
        let addCity = this.createdForm.controls.residenceAddressCity.value;
        this.createdForm.patchValue({ 'permanentAddressCity': addCity });
      }
    })
    this.createdForm.controls['residenceAddressState'].valueChanges.subscribe(c => {
      if (this.createdForm.controls['residenceAddressCheckBox'].value == true) {
        let addState = this.createdForm.controls.residenceAddressState.value;
        this.createdForm.patchValue({ 'permanentAddressState': addState });
      }
    })
    this.createdForm.controls['residenceAddressPostalCode'].valueChanges.subscribe(c => {
      if (this.createdForm.controls['residenceAddressCheckBox'].value == true) {
        let addPinCode = this.createdForm.controls.residenceAddressPostalCode.value;
        this.createdForm.patchValue({ 'permanentAddressPostalCode': addPinCode });
      }
    })

  }
  forDownloadSSNtoken: any = "";
  getPOLineItemBasedPlantId() {
    this.poLineItemsList = [];
    this.workLocationList = [];
    let obj = {
      "plantID": this.getElementData?.plantid,
      "purchaseOrder": this.getElementData?.purchaseOrder
    }
    this.loaderService.setShowLoading();
    if (this.getElementData && this.getElementData.plantid && this.getElementData.purchaseOrder) {

      this.API.getPOLineItemBasedPlantIdOB(obj).subscribe((res: any) => {
        this.loaderService.setDisableLoading();
        if (res && res.data && res.data.poLineitems && res.data.poLineitems.length > 0) {
          let uniqueArray = res.data.poLineitems.filter(function (item, pos) {
            return res.data.poLineitems.indexOf(item) == pos;
          })
          this.poLineItemsList = uniqueArray.sort((a, b) => a - b);
        }
        else if (res && res.data && res.data.poLineitems && res.data.poLineitems.length == 0) {
          this.snackBar.open("PO Line Items Data Not Found, You can't submit without Data*", 'Close', {
            duration: 5000,
          });
        }
        else {
          this.poLineItemsList = ['0']
        }
        if (res && res.data && res.data.plantInformation) {
          this.workLocationList = res.data.plantInformation;
          if (this.workLocationList && this.workLocationList.length == 0) {
            this.snackBar.open("Work Location Data Not Found, You can't submit without Data*", 'Close', {
              duration: 5000,
            });
          }
          else {
            let filterWrkLoc = this.workLocationList.filter((v) => { return v.name == this.getElementData?.workLocation })[0];
            if (filterWrkLoc) {
              this.createdForm.patchValue({ 'subWorkLocation': filterWrkLoc });
            }
          }
        }

      })
    }
    else {
      this.poLineItemsList = ['0'];
      this.snackBar.open("Work Location Data Not Found, You can't submit without Data*", 'Close', {
        duration: 5000,
      });
    }
  }
  getDategetDateSubmitDate: any = "";
  getDateFirstLevelSentBackDate: any = "";
  getDateSecondLevelSentBackDate: any = "";
  getDateFirstLevelApprovedDate: any = "";
  onboardingFirstApproveList: any = [];
  getDetailsInformation(params: any) {
    this.loaderService.setShowLoading();
    this.API.getDetailsInformationOBbyID(this.getElementData.id, this.userDetailsRoles).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      if (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack")) {
        if (response && response.data && response.data.resourceObRemarks) {
          this.remarksList = response.data.resourceObRemarks;
          let getDateSubmit = this.remarksList.filter((v => {
            return v.statusDescription == "Submitted"
          }));
          if (getDateSubmit && getDateSubmit.length > 0) {
            this.getDategetDateSubmitDate = getDateSubmit[0].createdOn;
          }
          let getDateFirstLevelSentBack = this.remarksList.filter((v => {
            return v.statusDescription == "First Level Sent Back"
          }));
          if (getDateFirstLevelSentBack && getDateFirstLevelSentBack.length > 0) {
            this.getDateFirstLevelSentBackDate = getDateFirstLevelSentBack[0].createdOn;
          }
          let getDateFirstLevelApproved = this.remarksList.filter((v => {
            return v.statusDescription == "First Level Approved"
          }));
          if (getDateFirstLevelApproved && getDateFirstLevelApproved.length > 0) {
            this.getDateFirstLevelApprovedDate = getDateFirstLevelApproved[0].createdOn;
          }
          let getDateSecondLevelSentBack = this.remarksList.filter((v => {
            return v.statusDescription == "Second Level Sent Back"
          }));
          if (getDateSecondLevelSentBack && getDateSecondLevelSentBack.length > 0) {
            this.getDateSecondLevelSentBackDate = getDateSecondLevelSentBack[0].createdOn;
          }
        }
      }
      if ((this.userDetailsRoles == '/Vendors' && params && params.draftEditOption == "EDIT") || (params && (params.statusSentBack == "FirstLevelSentBack" || params.statusSentBack == "SecondLevelSentBack"))) {
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

        if (response && response.data && response.data.resourceOBDocumentDetail) {
          this.onboardingUploadFileList = response.data.resourceOBDocumentDetail;
          this.photoDocumentFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "PhotoDocument" })[0];
          this.parentOrgFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "ParentOrgDocument" })[0];
          this.ispCertificateFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "EHSCertificateDocument" })[0];
          this.photoUploadFileName = this.photoDocumentFileGet ? this.photoDocumentFileGet.documentName : "";
          this.parentOrgUploadfileName = this.parentOrgFileGet ? this.parentOrgFileGet.documentName : "";
          this.ispSecurityUploadfileName = this.ispCertificateFileGet ? this.ispCertificateFileGet.documentName : "";
        }
        this.getEditFetchRecord(params);
      }

      if (params && (params.statusSentBack == "FirstLevelSentBack")) {
        if (this.userDetailsRoles == '/Vendors') {
          this.enabledFirstLevelFunction();
          this.disabledSecondLevelFunction();
        }
        else {
          this.disabledFirstLevelFunction();
          this.disabledSecondLevelFunction();
        }
        let obSendbackRemarkDetail = [];
        obSendbackRemarkDetail = response?.data?.resourceObSendbackRemarkDetail;
        this.sowJdSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == "SowjdSection" })[0];
        this.organizationSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == "OrganizationSection" })[0];
      }
      else if (params && (params.statusSentBack == "SecondLevelSentBack")) {
        if (this.userDetailsRoles == '/Vendors') {
          this.disabledFirstLevelFunction();
          this.disabledSecondLevelFunction();
          if (response && response.data && response.data.resourceObSendbackRemarkDetail) {
            let obSendbackRemarkDetail = [];
            obSendbackRemarkDetail = response?.data?.resourceObSendbackRemarkDetail;
            this.vendorSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'VendorSection' })[0];
            this.personalInfoSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'PersonalInformationSection' })[0];
            if (this.personalInfoSectionFilter) {
              this.personalInformationEnabled();
            }
            else {
              this.personalInformationDisabled();
            }
            this.contactInformationSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'ContactInformationSection' })[0];
            if (this.contactInformationSectionFilter) {
              this.contactInfoEnabled();
            }
            else {
              this.contactInfoDisabled();
            }
            this.identityInformationSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'IdentityInformationSection' })[0];
            if (this.identityInformationSectionFilter) {
              this.identityInformationEnabled()

            }
            else {
              this.identityInformationDisabled()
            }
            this.residenceSectionSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'ResidenceSection' })[0];
            if (this.residenceSectionSectionFilter) {
              this.residenceAddressEnaabled();
            }
            else {
              this.residenceAddressDisabled();
            }
            this.workExperienceSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'WorkExperienceSection' })[0];
            this.previousWorkedSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'PreviousWorkedSection' })[0];
            if (this.previousWorkedSectionFilter) {
              this.createdForm.controls['workedPreviousYearFormControlName'].enable();
              this.createdForm.controls['boschEmployeeNumber'].enable();
              this.createdForm.controls['lwdBgsw'].enable();
            }
            else {
              this.createdForm.controls['workedPreviousYearFormControlName'].disable();
              this.createdForm.controls['boschEmployeeNumber'].disable();
              this.createdForm.controls['lwdBgsw'].disable();
            }
            this.photoSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'PhotoSection' })[0];
            this.parentOrgSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'ParentOrgCardSection' })[0];
            this.ispCertificateSectionFilter = obSendbackRemarkDetail?.filter((v: any) => { return v.section == 'IspCertificateSection' })[0];
          }
        }
        else {
          this.disabledFirstLevelFunction();
          this.disabledSecondLevelFunction();
        }
      }
      else {
        this.enabledFirstLevelFunction();
        this.enabledSecondLevelFunction();
      }
    })
  }


  getEditFetchRecord(params: any) {
    this.getElementData = {
      sowJdNumber: this.resourceObSowjdOrderDetailData.soWJdID,
      sowjdDescription: this.resourceObSowjdOrderDetailData.sowjdDescription,
      sowJdType: this.resourceObSowjdOrderDetailData.sowJdType,
      skillsetName: this.resourceObSowjdOrderDetailData.skillset,
      grade: this.resourceObSowjdOrderDetailData.grade,
      outSourcingType: this.resourceObSowjdOrderDetailData.outSourcingType,
      locationMode: this.resourceObSowjdOrderDetailData.location,
      workLocation: this.resourceObSowjdOrderDetailData.workLocation,
      purchaseOrder: this.resourceObSowjdOrderDetailData.purchaseOrder,
      poLineItem: String(this.resourceObSowjdOrderDetailData.poLineitem),
      resourceOnboardingDate: this.resourceObSowjdOrderDetailData.requestedDateofJoining,
      expectedDoj: this.resourceObSowjdOrderDetailData.expectedDateOfJoing,
      contractEndDate: this.resourceObSowjdOrderDetailData.contractEndDate,
      billable: this.resourceObSowjdOrderDetailData.isBillable,
      billingStartDate: this.resourceObSowjdOrderDetailData.billingStartDate,
      company: this.resourceObOrganizationDetailData.company,
      companyName: this.resourceObOrganizationDetailData.companyName,
      groupName: this.resourceObOrganizationDetailData.groupName,
      departmentName: this.resourceObOrganizationDetailData.departmentName,
      sectionName: this.resourceObOrganizationDetailData.sectionName,
      buName: this.resourceObOrganizationDetailData.buName,
      gbBusinessArea: this.resourceObOrganizationDetailData.gbBusinessArea,
      sectionSpoc: this.resourceObOrganizationDetailData.sectionSPOC,
      deliveryManager: this.resourceObOrganizationDetailData.deliveryManager,
      joiningLocation: this.resourceObOrganizationDetailData.joiningLocation,
      vendorSAPID: this.vendorDetailsData?.vendorId,
      vendorName: this.vendorDetailsData?.vendorName,
      vendorEmail: this.vendorDetailsData?.vendorEmail,
      personalInfoTitle: this.resourceObResourceDetailsData.title,
      personalInfoFirstName: this.resourceObResourceDetailsData.firstName,
      personalInfoMiddleName: this.resourceObResourceDetailsData.middleName,
      personalInfoLastName: this.resourceObResourceDetailsData.lastName,
      personalInfoLastDOB: this.resourceObResourceDetailsData.dateofBirth,
      personalInfoGender: this.resourceObResourceDetailsData.gender,
      personalInfoNationality: this.resourceObResourceDetailsData.nationality,
      officialEmailID: this.resourceObResourceDetailsData.officialEmailId,
      primaryCountryMobileCode: this.resourceObResourceDetailsData.primaryContactCode,
      primaryContactNumber: Number(this.resourceObResourceDetailsData.primaryContactNumber),
      alternateCountryMobileCode: this.resourceObResourceDetailsData.alternateContactCode,
      alternateContactNumber: Number(this.resourceObResourceDetailsData.alternateContactNumber),
      emergencyContactName: this.resourceObResourceDetailsData.emergencyContactName,
      emergencyContactMobileCode: this.resourceObResourceDetailsData.emergencyContactCode,
      emergencyContactMobileNumber: Number(this.resourceObResourceDetailsData.emergencyNumber),
      idNumber: this.resourceObResourceDetailsData.idNumber,
      identityType: this.resourceObResourceDetailsData.identityType,
      poaIdType: this.resourceObResourceDetailsData.poaIdType,
      residentAddressHouseNoStreet: this.resourceObResourceDetailsData.residentAddressHouseNoStreet,
      residentAddressLandMark: this.resourceObResourceDetailsData.residentAddressLandMark,
      residentAddressCity: this.resourceObResourceDetailsData.residentAddressCity,
      residentAddressState: this.resourceObResourceDetailsData.residentAddressState,
      residentAddressPostalCode: this.resourceObResourceDetailsData.residentAddressPostalCode,
      permanentAddressHouseNoStreet: this.resourceObResourceDetailsData.permanentAddressHouseNoStreet,
      permanentAddressLandMark: this.resourceObResourceDetailsData.permanentAddressLandMark,
      permanentAddressCity: this.resourceObResourceDetailsData.permanentAddressCity,
      permanentAddressState: this.resourceObResourceDetailsData.permanentAddressState,
      permanentAddressPostalCode: this.resourceObResourceDetailsData.permanentAddressPostalCode,
      valueTotalExpYear: this.educationDetailsData.totalExperienceYear,
      valueTotalExpMonth: this.educationDetailsData.totalExperienceMonth,
      valueRelevantExpYear: this.educationDetailsData.relevantExperienceYear,
      valueRelevantExpMonth: this.educationDetailsData.relevantExperienceMonth,
      isWorkedPreviousYear: this.educationDetailsData.isPreviouslyWorkedinBGSW == false ? 'No' : 'Yes',
      boschEmployeeNumber: this.educationDetailsData.boschEmployeeNumber,
      lwdBgsw: this.educationDetailsData.lwDatBGSW,
    }
    if ((params && params.statusSentBack == "FirstLevelSentBack")) {
      this.getElementData.statusdescription = 'First Level Sent Back';
    }
    if (params.statusSentBack == "SecondLevelSentBack") {
      this.getElementData.statusdescription = 'Second Level Sent Back';
    }
    let filterWrkLoc = this.workLocationList.filter((v) => { return v.name == this.getElementData.workLocation })[0]
    this.createdForm.patchValue({ 'subWorkLocation': filterWrkLoc });// this.getElementData.workLocation });
    this.createdForm.patchValue({ 'poLineItem': this.getElementData.poLineItem });
    this.createdForm.patchValue({ 'billable': this.getElementData.billable == true ? 'True' : 'False' });
    this.createdForm.patchValue({ 'billableStartDate': new Date(this.getElementData.billingStartDate) });

    let _getExpectedDoj = new Date(this.getElementData?.expectedDoj);
    let forCheckTodaydateforEcpected = new Date();
    if (forCheckTodaydateforEcpected < _getExpectedDoj) {
      _getExpectedDoj = new Date(this.getElementData?.expectedDoj);
    }
    else {
      this.getExpectedDOJ();
      _getExpectedDoj = new Date(this.todayDateShowAfterSeven);
    }

    this.createdForm.patchValue({ 'expectedDoj': _getExpectedDoj });
    this.minBillingDateShow = new Date(this.getElementData.expectedDoj);
    this.createdForm.patchValue({ 'personalInfoTitle': this.getElementData.personalInfoTitle });
    this.createdForm.patchValue({ 'personalInfoFirstName': this.getElementData.personalInfoFirstName });
    this.createdForm.patchValue({ 'personalInfoMiddleName': this.getElementData.personalInfoMiddleName });
    this.createdForm.patchValue({ 'personalInfoLastName': this.getElementData.personalInfoLastName });
    this.createdForm.patchValue({ 'personalInfoLastDOB': this.getElementData.personalInfoLastDOB });
    this.createdForm.patchValue({ 'personalInfoGender': this.getElementData.personalInfoGender });
    this.createdForm.patchValue({ 'personalInfoNationality': this.getElementData.personalInfoNationality });
    this.createdForm.patchValue({ 'officialEmailID': this.getElementData.officialEmailID });
    this.createdForm.patchValue({ 'primaryCountryMobileCode': this.getElementData.primaryCountryMobileCode?.trim() });
    this.createdForm.patchValue({ 'primaryContactNumber': this.getElementData.primaryContactNumber });
    this.createdForm.patchValue({ 'alternateCountryMobileCode': this.getElementData.alternateCountryMobileCode?.trim() });
    this.createdForm.patchValue({ 'alternateContactNumber': this.getElementData.alternateContactNumber });
    this.createdForm.patchValue({ 'emergencyContactName': this.getElementData.emergencyContactName });
    this.createdForm.patchValue({ 'emergencyContactMobileCode': this.getElementData.emergencyContactMobileCode?.trim() });
    this.createdForm.patchValue({ 'emergencyContactMobileNumber': this.getElementData.emergencyContactMobileNumber });
    this.createdForm.patchValue({ 'idType': this.getElementData.identityType });
    this.createdForm.patchValue({ 'idNumber': this.getElementData.idNumber });
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
    this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': this.getElementData.valueTotalExpYear });
    this.createdForm.patchValue({ 'valueTotalExpMonthFormControlName': this.getElementData.valueTotalExpMonth });
    this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': this.getElementData.valueRelevantExpYear });
    this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.getElementData.valueRelevantExpMonth });
    this.createdForm.patchValue({ 'workedPreviousYearFormControlName': this.getElementData.isWorkedPreviousYear });
    this.createdForm.patchValue({ 'boschEmployeeNumber': this.getElementData.boschEmployeeNumber });
    this.createdForm.patchValue({ 'lwdBgsw': this.getElementData.lwdBgsw });
    if ((params && params.statusSentBack == "FirstLevelSentBack") || (params && params.draftEditOption == "EDIT") || (params && params.statusSentBack == "SecondLevelSentBack")) {
      this.createdForm.controls['photoUploadFileFormControlName'].setValidators(null);
      this.createdForm.controls['parentOrgUploadFileFormControlName'].setValidators(null);
      this.createdForm.controls['ispSecurityUploadFileFormControlName'].setValidators(null);
      this.createdForm.controls['photoUploadFileFormControlName'].updateValueAndValidity();
      this.createdForm.controls['parentOrgUploadFileFormControlName'].updateValueAndValidity();
      this.createdForm.controls['ispSecurityUploadFileFormControlName'].updateValueAndValidity();
    }
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
    let _checkValueOfrelevant = this.createdForm.controls.valueRelevantExpYearFormControlName.value;
    if (this.valueTotalExpYear <= 0) {
      this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': 0 });
    }
    else {
      this.valueTotalExpYear--;
      this.createdForm.patchValue({ 'valueTotalExpYearFormControlName': this.valueTotalExpYear });
      let chekValueRotalExpYear = this.valueTotalExpYear;
      if (_checkValueOfrelevant > chekValueRotalExpYear) {
        this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': chekValueRotalExpYear });
        this.valueRelevantExpYear = this.createdForm.controls.valueRelevantExpYearFormControlName.value;
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

      if ((this.valueTotalExpYear == this.valueRelevantExpYear) && (this.valueTotalExpMonth < this.valueRelevantExpMonth)) {
        this.valueRelevantExpMonth = this.valueTotalExpMonth;
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
    let _checkValueOftotal = this.createdForm.controls.valueTotalExpYearFormControlName.value;
    if (_checkValueOftotal == this.valueRelevantExpYear) {
      return;
    }
    else {
      this.valueRelevantExpYear++;
      let _checkvalueofrelevant = this.valueRelevantExpYear;
      if (_checkValueOftotal < _checkvalueofrelevant) {
        this.createdForm.patchValue({ 'valueRelevantExpYearFormControlName': _checkValueOftotal });
      }
      else {
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

      if ((this.valueTotalExpYear == this.valueRelevantExpYear) && (this.valueTotalExpMonth < this.valueRelevantExpMonth)) {
        this.valueRelevantExpMonth = this.valueTotalExpMonth;
        this.createdForm.patchValue({ 'valueRelevantExpMonthFormControlName': this.valueRelevantExpMonth });
      }
    }
  }


  photoUploadFileName: any = "";
  parentOrgUploadfileName: any = "";
  ispSecurityUploadfileName: any = "";
  photoFinalResultUpload: any = {};
  parentOrgFinalResultUpload: any = {};
  ispCertificateFinalResultUpload: any = {};
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


      if (uploadFileType == 'PhotoDocument') { this.photoFinalResultUpload = uploadObj; }
      if (uploadFileType == 'ParentOrgDocument') { this.parentOrgFinalResultUpload = uploadObj; }
      if (uploadFileType == 'EHSCertificateDocument') { this.ispCertificateFinalResultUpload = uploadObj; }

    };
  }

  validateFileType(event: any, elementId: any) {
    let result = false;
    let file = event.target.files;
    var size1 = Number((file[0].size / 1024 / 1024).toFixed(2));//In MB

    var fileName = file[0].name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();

    if (((extFile == "pdf") && (elementId != 'photoUpload'))) {
      if (size1 > 1) {
        (document.getElementById(elementId) as HTMLInputElement).value = "";
        this.snackBar.open("File size upto 1 MB is allowed*", 'Close', {
          duration: 5000,
        });
        result = false;
        return;
      }
      result = true;
      return result;

    }
    else if ((extFile == "jpg" && (elementId == 'photoUpload'))) {
      if (size1 > 1) {
        (document.getElementById(elementId) as HTMLInputElement).value = "";
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
      if (elementId == 'photoUpload') {
        this.snackBar.open("Photo Allow only to upload JPG file format*", 'Close', {
          duration: 5000,
        });
      }
      else {
        this.snackBar.open("Only pdf file format is allowed!", 'Close', {
          duration: 5000,
        });
      }
      result = false;
      return result;
    }
  }


  selectedFilesSSC: any = [];
  selFilesSSC: any = [];
  sscArrayFile: any = [];

  selectedFilesHighestQualification: any = [];
  selFileHighestQaul: any = [];
  highestDegreeArrayFile: any = [];

  changeUploadPhoto(event: any) {
    let result = this.validateFileType(event, 'photoUpload');
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

  changeUploadParentOrg(event: any) {
    let result = this.validateFileType(event, 'parentOrgUpload');
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

  changeUploadISPsecurity(event: any) {
    let result = this.validateFileType(event, 'ispSecurityUpload');
    if (result == true) {
      var fileInput = (document.getElementById('ispSecurityUpload')) as HTMLInputElement;
      this.ispSecurityUploadfileName = fileInput.value.split('\\').pop();
      this.uploadFileCommonMethod("EHSCertificateDocument", event);
    }
  }
  deleteUploadISPsecurity() {
    this.ispSecurityUploadfileName = '';
    this.createdForm.patchValue({ 'ispSecurityUploadFileFormControlName': null });
  }

  saveButton(type: any) {
    debugger;
    let _getPathUrl = environment.mailDeboardUrl;
    let showAlertSuccessMessage = "";
    this.loaderService.setShowLoading();
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

    if (type == 'Resubmit') {
debugger;
      let photoFile = Object.keys(this.photoFinalResultUpload).length != 0 ? this.photoFinalResultUpload : this.photoDocumentFileGet;
      let parentOrgFile = Object.keys(this.parentOrgFinalResultUpload).length != 0 ? this.parentOrgFinalResultUpload : this.parentOrgFileGet;
      let ispCertificateFile = Object.keys(this.ispCertificateFinalResultUpload).length != 0 ? this.ispCertificateFinalResultUpload : this.ispCertificateFileGet;
      this.photoFinalResultUpload = photoFile;
      this.parentOrgFinalResultUpload = parentOrgFile;
      this.ispCertificateFinalResultUpload = ispCertificateFile;
    }
    let documentsModel: any = [
      { ...this.photoFinalResultUpload },
      { ...this.parentOrgFinalResultUpload },
      { ...this.ispCertificateFinalResultUpload },
    ];
    const documentsModelArray = documentsModel.filter(element => {
      if (Object.keys(element).length !== 0) {
        return true;
      }
      return false;
    });
    let obj =
    {
      "sowjdID": type == 'Resubmit' ? this.getElementData.id : this.getElementData.sowjdID,
      "workLocation": this.f.subWorkLocation.value.name,
      "poLineitem": Number(this.f.poLineItem.value),
      "expectedDOJ": expectedDojdate,
      "isBillable": this.f.billable.value == 'True' ? true : this.f.billable.value == 'False' ? false : false,
      "billingStartDate": billSdate,
      "outSourcingType": this.getElementData.outSourcingType,
      "vendorId": this.userDetailsRoles == '/Vendors' ? this.profileInformation.vendor_id : '',  
      "resourceType":"",  
      "regNameSubContractor": "",
      "domainIdSubContractor": "",
      "msaScopeExtensionUrl": "",
      "title": this.f.personalInfoTitle.value,
      "firstName": this.f.personalInfoFirstName.value,
      "middleName": this.f.personalInfoMiddleName.value,
      "lastName": this.f.personalInfoLastName.value,
      "dateofBirth": this.f.personalInfoLastDOB.value,
      "gender": this.f.personalInfoGender.value,
      "nationality": this.f.personalInfoNationality.value,
      "officialEmailId": this.f.officialEmailID.value,
      "personalEmailId":"",
      "primaryContactCode": this.f.primaryCountryMobileCode.value,
      "primaryContactNumber": String(this.f.primaryContactNumber.value),
      "alternateContactCode": this.f.alternateCountryMobileCode.value,
      "alternateContactNumber": String(this.f.alternateContactNumber.value),
      "emergencyContactName": this.f.emergencyContactName.value,
      "emergencyContactCode": this.f.emergencyContactMobileCode.value,
      "emergencyNumber": String(this.f.emergencyContactMobileNumber.value),
      "identityType": this.f.idType.value,
      "idNumber": this.f.idNumber.value,
      "poaIdType": "",
      "poaDocUrl":"",
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

      "sscBoard": "",
      "sscInstitution":"",
      "sscYearofPass": "",
      "sscPercentage":"",
      "sscMode": "",
      "sscDocurl":"",
      "highestQualification": "",
      "highestSpecialization": "",
      "highestInstitution": "",
      "highestYearofPass": "",
      "highestPercentage":"",
      "highestMode":"",
      "highestDocurl": "",

      "totalExperienceYear": Number(this.f.valueTotalExpYearFormControlName.value),
      "totalExperienceMonth": Number(this.f.valueTotalExpMonthFormControlName.value),
      "relevantExperienceYear": Number(this.f.valueRelevantExpYearFormControlName.value),
      "relevantExperienceMonth": Number(this.f.valueRelevantExpMonthFormControlName.value),
      "isPreviouslyWorkedinBGSW": this.f.workedPreviousYearFormControlName.value == 'Yes' ? true : false,
      "boschEmployeeNumber": this.f.boschEmployeeNumber.value,
      "lwDatBGSW": lwdBgswDate,
      "photoDocUrl": this.photoUploadFileName,
      "parentOrgidcardDocUrl": this.parentOrgUploadfileName,
      "ispCertificateDocUrl": this.ispSecurityUploadfileName,

      "purchaseOrderDocUrl": "",
      "louDocUrl": "",
      "bgvReportDocUrl":"",
      "ispTrainingAckDocUrl": "",      
      "previouEmployeeExpDocUrl": "",      
      "declarationOfObligDocUrl": "",
      "loaDocUrl": "",

      "statusID": statusId,
      "isISPtrainingCompleted": this.onOBSubmitFirstCheckboxVallue,
      "isBGVcompletedandPassed": this.onOBSubmitThirdCheckboxVallue,
      "isConfirmDeclaration": this.onOBSubmitSecondCheckboxVallue,
      "remark": this.onOBSubmitRemarksTextVallue,
      "createdBy": this.vendorName,
      "compnayCode":this.getElementData.company,
      "documentsModel": documentsModelArray
    }

    if (type == 'Submit' || type == 'Save Draft') {
      debugger;
      this.loaderService.setShowLoading();
      obj["gradeId"] = this.getElementData.gradeId;
      obj["skillSetId"] = this.getElementData.skillSetId;
      obj["plantId"] = this.f.subWorkLocation.value.plantId;
      obj["firstApproverNtid"] = this.getElementData?.firstApproverNtid;
      obj["secondApproverNtid"] = this.getElementData?.secondApproverNtid;
      obj["tpResourcePlanId"] = this.getElementData?.tpResourcePlanId;
      obj["techProposalId"] = this.getElementData?.techProposalId;
      if (this.getElementData?.replacementOrder == true) {
        obj["replacementOrder"] = true;
        obj["deboardingRequestID"] = this.getElementData?.deboardingRequestID;
      }
      else {
        obj["replacementOrder"] = false;
        obj["deboardingRequestID"] = "";
      }
debugger;
      this.API.saveOnboardingPostApi(obj).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        debugger;
        if (response && response.status == "success") {
          let obRequestID = "";
          let splitData="";
          if (response && response.data) {
             splitData=response.data?.split(' ID:');
            obRequestID = splitData[0];
          }
          this.showHideVerifyEmailIDButton1 = true;
          this.showHideVerifyEmailIDButton2 = false;
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
              to: this.getElementData?.firstApproverMailId,
              cc: this.getElementData?.email,
              subject: 'ENRICO | Onboarding | ' + obRequestID + ' | Request Approval',
              paraInTemplate: {
                teamName: this.getElementData?.firstApproverName || 'All',
                mainText: 'Below Request is awaiting your approval.' + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + obRequestID + "</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> " + this.getElementData.vendorName + " </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + _getPathUrl + "/Onboarding?data=onboarding&getOnboardRequestID="+splitData[1]+" target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + _getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(this.onOBSubmitRemarksTextVallue) + "</td></tr></table>",
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
          else {
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
      obj["resourceOBRequestID"] = this.getElementData.id
      obj["idSowjdDetails"] = this.resourceObSowjdOrderDetailData.idSowjdDetails;;
      obj["idVendorDetails"] = this.vendorDetailsData.idVendorDetails;
      obj["idResourceDetails"] = this.resourceObResourceDetailsData.idResourceDetails;
      obj["idEduWorkDetails"] = this.educationDetailsData.idEduWorkDetails;

      this.API.getUpdateRequestOB(this.userDetailsRoles, obj).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response && response.status == "success") {
          this.snackBar.open(showAlertSuccessMessage, 'Close', {
            duration: 4000,
          });
          this.showHideVerifyEmailIDButton1 = true;
          this.showHideVerifyEmailIDButton2 = false;
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
              to: this.onboardingFirstApproveList?.firstApproverEmail,
              cc: this.vendorDetailsData?.vendorEmail,
              subject: 'ENRICO | Onboarding | ' + this.getElementData.sowJdNumber + '| Request Approval',
              paraInTemplate: {
                teamName: this.getElementData?.firstApproverName || 'All',
                mainText: 'Below Request is awaiting your approval.' + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + this.getElementData.sowJdNumber + "</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> " + this.getElementData.vendorName + " </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + _getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + _getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(this.onOBSubmitRemarksTextVallue) + "</td></tr></table>",
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
          else {
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
     debugger;
    if (this.verifiedOtp == false) {
      this.snackBar.open("Official email not verfied with verification code. Please Verify official email with verification code.", 'Close', {
        duration: 5000,
      });
      return;
    }
    else if (this.verifiedOtp == true) {

      let element = this.getElementData;
      let _obj = {
        rowData: element,
        type: type,
        checkButtonType: this.editSubmit,
        checkCompanyCodeGlobal:this.checkCompanyCodeGlobalData
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
          else if (type == 'Resubmit' && result.data.btnStbmitType != 'EDIT') {
            this.onOBSubmitFirstCheckboxVallue = false;
            this.onOBSubmitSecondCheckboxVallue = false;
            this.onOBSubmitThirdCheckboxVallue = false;
          }
          else if (type == 'Resubmit' && result.data.btnStbmitType == 'EDIT') {
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
    newDate.setDate(newDate.getDate() + 7);
    this.todayDateShowAfterSeven = newDate;


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

  generateOTPValue: any = "";
  otpSentFlag: boolean = false;
  verifiedOtp: boolean = false;
  clickVerifyEmailButton() {
    this.createdForm.controls['officialEmailID'].enable();
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
    this.API.getCheckExitEmailOB(officialWmailID).subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      if (res && res.data && res.data == true) {

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
            this.showHideVerifyEmailIDButton1 = false;
            this.showHideVerifyEmailIDButton2 = false;
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
            this.showHideVerifyEmailIDButton1 = false;
            this.showHideVerifyEmailIDButton2 = false;
            this.timer(120);
          }
          );
        }
      }
      else {
        this.snackBar.open("This Email ID is mapped with another resource*", 'Close', {
          duration: 4000,
        });
        this.createdForm.patchValue({ 'officialEmailID': '' });
        return;
      }
    });
  }
  showHideVerifyEmailIDButton1: boolean = true;
  showHideVerifyEmailIDButton2: boolean = false;
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
  reSubmitDialogOpen(type: any) {
    let photo1 = this.photoUploadFileName;
    let parentOrg1 = this.parentOrgUploadfileName;
    let ispCertificate1 = this.ispSecurityUploadfileName;
    if (photo1 == "" || photo1 == null || photo1 == undefined) {
      this.snackBar.open("Please Upload Photo *", 'Close', {
        duration: 3000,
      });
      return;
    }
    if (parentOrg1 == "" || parentOrg1 == null || parentOrg1 == undefined) {
      this.snackBar.open("Please Upload Parent Organization ID Card *", 'Close', {
        duration: 4000,
      });
      return;
    }
    if (ispCertificate1 == "" || ispCertificate1 == null || ispCertificate1 == undefined) {
      this.snackBar.open("Please Upload Environment Health & Safety Certificate (EHS) *", 'Close', {
        duration: 4000,
      });
      return;
    }
    this.submitDialog(type);
  }

  minBillingDateShow: any = new Date();
  addExpectedDojChangeEvent(event: MatDatepickerInputEvent<Date>) {
    this.createdForm.patchValue({ 'billableStartDate': '' });
    this.minBillingDateShow = event.value;
  }


  disabledFirstLevelFunction() {
    this.createdForm.controls['subWorkLocation'].disable();
    this.createdForm.controls['poLineItem'].disable();
    this.createdForm.controls['expectedDoj'].disable();
    this.createdForm.controls['billable'].disable();
    this.createdForm.controls['billableStartDate'].disable();
  }
  enabledFirstLevelFunction() {
    this.createdForm.controls['subWorkLocation'].enable();
    this.createdForm.controls['poLineItem'].enable();
    this.createdForm.controls['expectedDoj'].enable();
    this.createdForm.controls['billable'].enable();
    this.createdForm.controls['billableStartDate'].enable();
  }
  disabledSecondLevelFunction() {
    this.createdForm.controls['personalInfoTitle'].disable();
    this.createdForm.controls['personalInfoFirstName'].disable();
    this.createdForm.controls['personalInfoMiddleName'].disable();
    this.createdForm.controls['personalInfoLastName'].disable();
    this.createdForm.controls['personalInfoLastDOB'].disable();
    this.createdForm.controls['personalInfoGender'].disable();
    this.createdForm.controls['personalInfoNationality'].disable();
    this.createdForm.controls['officialEmailID'].disable();
    this.createdForm.controls['primaryCountryMobileCode'].disable();
    this.createdForm.controls['primaryContactNumber'].disable();
    this.createdForm.controls['alternateCountryMobileCode'].disable();
    this.createdForm.controls['alternateContactNumber'].disable();
    this.createdForm.controls['emergencyContactName'].disable();
    this.createdForm.controls['emergencyContactMobileCode'].disable();
    this.createdForm.controls['emergencyContactMobileNumber'].disable();
    this.createdForm.controls['idType'].disable();
    this.createdForm.controls['idNumber'].disable();
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
    this.createdForm.controls['workedPreviousYearFormControlName'].disable();
    this.createdForm.controls['boschEmployeeNumber'].disable();
    this.createdForm.controls['lwdBgsw'].disable();


  }
  enabledSecondLevelFunction() {
    this.createdForm.controls['personalInfoTitle'].enable();
    this.createdForm.controls['personalInfoFirstName'].enable();
    this.createdForm.controls['personalInfoMiddleName'].enable();
    this.createdForm.controls['personalInfoLastName'].enable();
    this.createdForm.controls['personalInfoLastDOB'].enable();
    this.createdForm.controls['personalInfoGender'].enable();
    this.createdForm.controls['personalInfoNationality'].enable();
    this.createdForm.controls['officialEmailID'].enable();
    this.createdForm.controls['primaryCountryMobileCode'].enable();
    this.createdForm.controls['primaryContactNumber'].enable();
    this.createdForm.controls['alternateCountryMobileCode'].enable();
    this.createdForm.controls['alternateContactNumber'].enable();
    this.createdForm.controls['emergencyContactName'].enable();
    this.createdForm.controls['emergencyContactMobileCode'].enable();
    this.createdForm.controls['emergencyContactMobileNumber'].enable();
    this.createdForm.controls['idType'].enable();
    this.createdForm.controls['idNumber'].enable();
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
    this.createdForm.controls['workedPreviousYearFormControlName'].enable();
    this.createdForm.controls['boschEmployeeNumber'].enable();
    this.createdForm.controls['lwdBgsw'].enable();
  }
  photoClickDownload() {
    let fileURL = this.photoDocumentFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.photoDocumentFileGet.documentName;
    this.downloadFileMethod(fileURL, fileName);
  }
  parentOrgClickDownload() {
    let fileURL = this.parentOrgFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.parentOrgFileGet.documentName;
    this.downloadFileMethod(fileURL, fileName);
  }

  ispCertificateClickDownload() {
    let fileURL = this.ispCertificateFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.ispCertificateFileGet.documentName;
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
  getRemarkTextparagrapg(remarksValue: any) {
    return remarksValue.replace('FirstRejectedButtonOB:', ' ').replace('SecondRejectedButtonOB:', ' ').replace('SubmitRemarksFirstOBs:', ' ').replace('ReSubmitRemarksSecondOBs:', ' ')
  }


  timerOn: boolean = true;
  setTimerCount: any;
  timer(remaining) {
    let m: any = Math.floor(remaining / 60);
    let s: any = remaining % 60;
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;
    this.setTimerCount = m + ' minutes ' + s + ' seconds ';
    remaining -= 1;
    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.timer(remaining);
      }, 1000);
      return;
    }
    if (!this.timerOn) {
      return;
    }
    if (remaining == -1 && this.verifiedOtp == false) {
      this.createdForm.patchValue({ 'otpValueFormControlName': '' });
      this.verifiedOtp = false;
      this.otpSentFlag = false;
      this.showHideVerifyEmailIDButton1 = false;
      this.showHideVerifyEmailIDButton2 = true;
    }
    else if (remaining == -1 && this.verifiedOtp == true) {

    }
  }
  isNumberAndAlphabetKey(e: any) {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }
    e.preventDefault();
    return false;
  }


  personalInformationDisabled() {
    this.createdForm.controls['personalInfoTitle'].disable();
    this.createdForm.controls['personalInfoFirstName'].disable();
    this.createdForm.controls['personalInfoMiddleName'].disable();
    this.createdForm.controls['personalInfoLastName'].disable();
    this.createdForm.controls['personalInfoLastDOB'].disable();
    this.createdForm.controls['personalInfoGender'].disable();
    this.createdForm.controls['personalInfoNationality'].disable();
  }
  personalInformationEnabled() {
    this.createdForm.controls['personalInfoTitle'].enable();
    this.createdForm.controls['personalInfoFirstName'].enable();
    this.createdForm.controls['personalInfoMiddleName'].enable();
    this.createdForm.controls['personalInfoLastName'].enable();
    this.createdForm.controls['personalInfoLastDOB'].enable();
    this.createdForm.controls['personalInfoGender'].enable();
    this.createdForm.controls['personalInfoNationality'].enable();
  }

  contactInfoDisabled() {
    this.createdForm.controls['primaryCountryMobileCode'].disable();
    this.createdForm.controls['primaryContactNumber'].disable();
    this.createdForm.controls['alternateCountryMobileCode'].disable();
    this.createdForm.controls['alternateContactNumber'].disable();
    this.createdForm.controls['emergencyContactName'].disable();
    this.createdForm.controls['emergencyContactMobileCode'].disable();
    this.createdForm.controls['emergencyContactMobileNumber'].disable();
  }
  contactInfoEnabled() {
    this.createdForm.controls['primaryCountryMobileCode'].enable();
    this.createdForm.controls['primaryContactNumber'].enable();
    this.createdForm.controls['alternateCountryMobileCode'].enable();
    this.createdForm.controls['alternateContactNumber'].enable();
    this.createdForm.controls['emergencyContactName'].enable();
    this.createdForm.controls['emergencyContactMobileCode'].enable();
    this.createdForm.controls['emergencyContactMobileNumber'].enable();
  }

  identityInformationDisabled() {
    this.createdForm.controls['idType'].disable();
    this.createdForm.controls['idNumber'].disable();
  }
  identityInformationEnabled() {
    this.createdForm.controls['idType'].enable();
    this.createdForm.controls['idNumber'].enable();
  }

  residenceAddressDisabled() {
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
  residenceAddressEnaabled() {
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

}
