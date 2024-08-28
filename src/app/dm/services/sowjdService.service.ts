import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { PlaningService } from 'src/app/planning/services/planing.service';
import {
  PermissionDetails,
  userProfileDetails,
} from 'src/app/common/user-profile/user-profile';
import { HomeService } from 'src/app/services/home.service';
import { LoaderService } from 'src/app/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class sowjdService {
  userProfileDetails: userProfileDetails | any;
  dmRole: boolean;
  dhRole: boolean;
  bgswSpocRole: boolean;
  featureDetails: any;
  permissionDetails: PermissionDetails;
  permissionDetailsSoWJD: PermissionDetails;
  permissionDetailsRFQ: PermissionDetails;
  permissionDetailsSignOff: PermissionDetails;
  permissionDetailsSRN: PermissionDetails;
  sowJDAccessRoles: PermissionDetails;
  RFQAccessRoles: PermissionDetails;
  SignOffAccessRoles: PermissionDetails;
  SRNAccessRoles: PermissionDetails;

  private permissionsBehaviorSubjectSoWJD =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectRFQ =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectSignOff =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectSRN =
    new BehaviorSubject<PermissionDetails>(undefined);

  permissionDetailsResourcePlanOpenOrder: PermissionDetails;
  permissionDetailsOnboarding: PermissionDetails;
  permissionDetailsResourceMaster: PermissionDetails;
  permissionDetailsDeboarding: PermissionDetails;
  permissionDetailsChangeManagement: PermissionDetails;

  private permissionsBehaviorSubjectResourcePlanOpenOrder =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectOnboarding =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectResourceMaster =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectDeboarding =
    new BehaviorSubject<PermissionDetails>(undefined);
  private permissionsBehaviorSubjectChangeManagement =
    new BehaviorSubject<PermissionDetails>(undefined);

  constructor(
    private http: HttpClient,
    @Inject('MASTER_API_URL') private url: string,
    @Inject('Vendor_URL') private vendor_url: string,
    private planningService: PlaningService,
    private homeService: HomeService,
    private loaderService: LoaderService
  ) {
    this.checkUserProfileValueValid();
  }
  checkUserProfileValueValid() {
    const isVendor = JSON.parse(localStorage.getItem('isVendor'));
    if (!isVendor) {
      this.loaderService.setShowLoading();
      this.homeService.getProfileRoles().subscribe((roles: any) => {
        this.userProfileDetails = roles.data;
        this.checkUserProfileValueValidForResourceModule();
        this.loaderService.setDisableLoading();

        if (this.userProfileDetails.hasOwnProperty('roleDetail')) {
          const masterDataModules =
            this.userProfileDetails.roleDetail[0].roleDetails.filter(
              (item: any) =>
                item.moduleDetails.some(
                  (module: any) => module.moduleName === 'SOW JD'
                )
            );
          const masterDataFeatureDetails = masterDataModules.map(
            (item: any) => {
              const masterDataModule = item.moduleDetails.find(
                (module: any) => module.moduleName === 'SOW JD'
              );
              return masterDataModule.featureDetails;
            }
          );
          this.featureDetails = masterDataFeatureDetails;

          this.sowJDAccessRoles = {
            createPermission: false,
            readPermission: false,
            editPermission: false,
            deletePermission: false,
            approvePermission: false,
            rejectPermission: false,
            delegatePermission: false,
            withdrawPermission: false,
            importPermission: false,
            exportPermission: false,
            ownershipChangePermission: false,
            sendBackPermission: false,
          };
          this.RFQAccessRoles = {
            createPermission: false,
            readPermission: false,
            editPermission: false,
            deletePermission: false,
            approvePermission: false,
            rejectPermission: false,
            delegatePermission: false,
            withdrawPermission: false,
            importPermission: false,
            exportPermission: false,
            ownershipChangePermission: false,
            sendBackPermission: false,
          };
          this.SignOffAccessRoles = {
            createPermission: false,
            readPermission: false,
            editPermission: false,
            deletePermission: false,
            approvePermission: false,
            rejectPermission: false,
            delegatePermission: false,
            withdrawPermission: false,
            importPermission: false,
            exportPermission: false,
            ownershipChangePermission: false,
            sendBackPermission: false,
          };
          this.SRNAccessRoles = {
            createPermission: false,
            readPermission: false,
            editPermission: false,
            deletePermission: false,
            approvePermission: false,
            rejectPermission: false,
            delegatePermission: false,
            withdrawPermission: false,
            importPermission: false,
            exportPermission: false,
            ownershipChangePermission: false,
            sendBackPermission: false,
          };
          for (let plan of this.featureDetails) {
            for (let item of plan) {
              if (item.featureCode.toLowerCase() == 'sowjd') {
                for (const permission in this.sowJDAccessRoles) {
                  if (
                    item.permissionDetails[0].hasOwnProperty(permission) &&
                    item.permissionDetails[0][permission] == true
                  ) {
                    this.sowJDAccessRoles[permission] = true;
                  }
                }

                this.permissionDetailsSoWJD = this.sowJDAccessRoles;
              }
              if (item.featureCode.toLowerCase() == 'request_for_quote') {
                for (const permission in this.RFQAccessRoles) {
                  if (
                    item.permissionDetails[0].hasOwnProperty(permission) &&
                    item.permissionDetails[0][permission] == true
                  ) {
                    this.RFQAccessRoles[permission] = true;
                  }
                }
                this.permissionDetailsRFQ = this.RFQAccessRoles;
              }
              if (item.featureCode.toLowerCase() == 'technical_sign_off') {
                for (const permission in this.SignOffAccessRoles) {
                  if (
                    item.permissionDetails[0].hasOwnProperty(permission) &&
                    item.permissionDetails[0][permission] == true
                  ) {
                    this.SignOffAccessRoles[permission] = true;
                  }
                }

                this.permissionDetailsSignOff = this.SignOffAccessRoles;
              }
              if (item.featureCode.toLowerCase() == 'service_request_note') {
                for (const permission in this.SRNAccessRoles) {
                  if (
                    item.permissionDetails[0].hasOwnProperty(permission) &&
                    item.permissionDetails[0][permission] == true
                  ) {
                    this.SRNAccessRoles[permission] = true;
                  }
                }
                this.permissionDetailsSRN = this.SRNAccessRoles;
              }
            }
          }
          this.permissionsBehaviorSubjectSoWJD.next(
            this.permissionDetailsSoWJD
          );
          this.permissionsBehaviorSubjectRFQ.next(this.permissionDetailsRFQ);
          this.permissionsBehaviorSubjectSignOff.next(
            this.permissionDetailsSignOff
          );
          this.permissionsBehaviorSubjectSRN.next(this.permissionDetailsSRN);
        }
      });
    }
  }

  getUserProfileRoleDetailSoWJD() {
    return this.permissionsBehaviorSubjectSoWJD.asObservable();
  }

  getUserProfileRoleDetailRFQ() {
    return this.permissionsBehaviorSubjectRFQ.asObservable();
  }

  getUserProfileRoleDetailSignOff() {
    return this.permissionsBehaviorSubjectSignOff.asObservable();
  }

  getUserProfileRoleDetailSRN() {
    return this.permissionsBehaviorSubjectSRN.asObservable();
  }

  getProfileRoles() {
    this.loaderService.setShowLoading();
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.userProfileDetails = response.data;

        this.planningService.profileDetails = response.data;
        StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
        const masterDataModules =
          this.userProfileDetails.roleDetail[0].roleDetails.filter(
            (item: any) =>
              item.moduleDetails.some(
                (module: any) => module.moduleName === 'SOW JD'
              )
          );
        const masterDataFeatureDetails = masterDataModules.map((item: any) => {
          const masterDataModule = item.moduleDetails.find(
            (module: any) => module.moduleName === 'SOW JD'
          );
          return masterDataModule.featureDetails;
        });

        this.featureDetails = masterDataFeatureDetails;
        this.permissionDetails = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
          ownershipChangePermission: false,
          sendBackPermission: false,
        };

        for (let plan of this.featureDetails) {
          for (let item of plan) {
            if (
              item.featureCode.toLowerCase() == 'sowjd' ||
              item.featureCode.toLowerCase() == 'request_for_quote' ||
              item.featureCode.toLowerCase() == 'technical_sign_off' ||
              item.featureCode.toLowerCase() == 'service_request_note'
            ) {
              for (const permission in this.permissionDetails) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.permissionDetails[permission] = true;
                }
              }
            }
          }
        }
        this.loaderService.setDisableLoading();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  getSignOffStatusColor(statusId: number): string {
    if (
      statusId === 1 ||
      statusId === 2 ||
      statusId === 4 ||
      statusId === 5 ||
      statusId === 6 ||
      statusId === 7 ||
      statusId === 8 ||
      statusId === 12
    ) {
      return 'remarks-green';
    } else if (statusId === 3) {
      return 'remarks-red';
    } else if (statusId === 9) {
      return 'remarks-withdraw';
    }
    return ''; // Default color
  }

  getRFQStatusColor(statusId: number): string {
    if (statusId === 1 || statusId === 4 || statusId === 6) {
      return 'remarks-green';
    } else if (statusId === 3 || statusId === 8) {
      return 'remarks-red';
    } else if (statusId === 7) {
      return 'remarks-withdraw';
    }
    return ''; // Default color
  }

  getSRNStatusColor(statusId: number): string {
    if (statusId === 1 || statusId === 2 || statusId === 5 || statusId === 7) {
      return 'remarks-green';
    } else if (statusId === 6 || statusId === 3 || statusId === 8) {
      return 'remarks-red';
    } else if (statusId === 4 || statusId === 9) {
      return 'remarks-withdraw';
    } else if (statusId === 10) {
      return 'remarks-delegatation';
    }
    return ''; // Default color
  }

  getStatusColor(statusId: number): string {
    if (statusId === 2 || statusId === 3 || statusId === 4 || statusId === 1) {
      return 'remarks-green';
    } else if (statusId === 5 || statusId === 17 || statusId === 7) {
      return 'remarks-red';
    } else if (statusId === 6) {
      return 'remarks-withdraw';
    } else if (statusId === 98 || statusId === 99) {
      return 'remarks-delegatation';
    }
    return ''; // Default color
  }

  getSOWJDRequestList() {
    return this.http.get(`${this.url}/api/sowjd/sowjd-requests?orderBy=desc`);
  }

  getsowjdRFQTechEvaluation() {
    return this.http.get(`${this.url}/api/rfq/my-rfq`);
  }

  getsowjdRFQSignOff() {
    return this.http.get(
      `${this.url}/api/SowJdTechnicalProposalController/my-Technical-proposal/desc`
    );
  }

  postProjectData(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-ProjectData`;
    return this.http.post(url, data, { params });
  }

  postPOValueData(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/AddPoValue`;
    return this.http.post(url, data, { params });
  }

  postUserDepartment(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-UserDepartment`;
    return this.http.post(url, data, { params });
  }
  postPOData(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-Po`;
    return this.http.post(url, data, { params });
  }

  getCompanymasterDetail() {
    const url = `${this.url}/api/master-data?menuId=2`;
    return this.http.get(url);
  }
  getPlantMasterDetails() {
    const url = `${this.url}/api/master-data?menuId=3`;
    return this.http.get(url);
  }
  getFundCenterDetail() {
    const url = `${this.url}/api/master-data?menuId=23`;
    return this.http.get(url);
  }
  getVendorMasterDetail() {
    const url = `${this.url}/api/master-data?menuId=4`;
    return this.http.get(url);
  }

  getSkillSetMasterData() {
    const url = `${this.url}/api/master-data?menuId=1`;
    return this.http.get(url);
  }
  getSowjdMasterData() {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-master-data`;
    return this.http.get(url, { params });
  }

  getSowjdRequestById(SOWJDID: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');

    const url = `${this.url}/api/sowjd/sowjd-request-by-id/${SOWJDID}`;
    return this.http.get(url, { params });
  }
  getDocuments(sowjd: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-documents/${sowjd}`;
    return this.http.get(url, { params });
  }

  getApprovedStatus(sowJdId: string) {
    return this.http.get(`${this.url}/api/sowjd/sowjd-approvals/${sowJdId}`);
  }

  getAllSowjdDetails(sowJdId: string) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    let sowjdDetails = this.http.get(
      `${this.url}/api/sowjd/sowjd-request-by-id/${sowJdId}`,
      { params }
    );

    let documents = this.http.get(
      `${this.url}/api/sowjd/sowjd-documents/${sowJdId}`,
      { params }
    );

    return forkJoin([sowjdDetails, documents]);
  }
  deleteDocuments(deldoc: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-documents`;
    return this.http.put(url, deldoc, { params });
  }

  getSowjdId() {
    const params = new HttpParams().set('featureCode', 'sowjd');

    const url = `${this.url}/api/sowjd/create-sowjdId`;
    return this.http.get(url, { params });
  }
  getCloneSowjJd(sowJdId: string) {
    const url = `${this.url}/api/sowjd/sowjd-clone/${sowJdId}`;
    return this.http.get(url);
  }

  postSubmitSowjdForm(data: any) {
    const url = `${this.url}/api/sowjd/create-sowjd`;
    return this.http.post(url, data);
  }
  patchSubmitSowjdForm(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd`;
    return this.http.patch(url, data, { params });
  }
  postSkillSet(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-skillSet`;
    return this.http.post(url, data, { params });
  }

  getVendorSuggestinsSkillIds(sowJdId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('vendorName', searchValue);
    }
    return this.http.get(
      `${this.url}/api/sowjd/sowjd-vendor-suggestions/${sowJdId}`,
      {
        params,
      }
    );
  }

  getGroupList(companyId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('groupCode', searchValue);
    }
    return this.http.get(
      `${this.url}/api/Users/groupcode-autosuggestion/${companyId}`,
      {
        params,
      }
    );
  }

  getFundCenter(companyId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('fundCenter', searchValue);
    }
    return this.http.get(
      `${this.url}/api/Users/fundcenter-autosuggestion/${companyId}`,
      {
        params,
      }
    );
  }

  getLocationPlant(companyId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('plant', searchValue);
    }
    return this.http.get(
      `${this.url}/api/Users/plant-autosuggestion/${companyId}`,
      {
        params,
      }
    );
  }

  getSkillsetList(searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('skillSetName', searchValue);
    }
    return this.http.get(`${this.url}/api/Users/skillset-autosuggestion`, {
      params,
    });
  }

  getVendorList(searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('vendorName', searchValue);
    }
    return this.http.get(`${this.url}/api/Users/vendor-autosuggestion`, {
      params,
    });
  }

  getCostCenterList(sowJdId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('costCenter', searchValue);
    }
    return this.http.get(
      `${this.url}/api/Users/costcenter-autosuggestion/${sowJdId}`,
      {
        params,
      }
    );
  }

  getReferenceList(companyId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('sowJdNumber', searchValue);
    }
    return this.http.get(
      `${this.url}/api/sowjd/sowjdreference-autosuggestion/${companyId}`,
      {
        params,
      }
    );
  }

  getWBSList(companyId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('wbsElement', searchValue);
    }
    return this.http.get(
      `${this.url}/api/Users/wbselement-autosuggestion/${companyId}`,
      {
        params,
      }
    );
  }

  getSkillSetForInitiateSignOff(sowJdId: any) {
    const url = `${this.url}/api/rfq/sowjd-rfq-details/${sowJdId}`;
    return this.http.get(url);
  }

  getSkillSet(sowJdId: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-skillset/${sowJdId}`;
    return this.http.get(url, { params });
  }

  getSignOffSkillSet(tpId: any) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/get-tpskillset/${tpId}`;
    return this.http.get(url);
  }
  postVendorSuggestion(data: any) {
    const url = `${this.url}/api/sowjd/sowjd-vendor`;
    return this.http.post(url, data);
  }
  getVendorSuggestion(sowJdId: any) {
    const url = `${this.url}/api/sowjd/sowjd-vendors/${sowJdId}`;
    return this.http.get(url);
  }
  removeVenderSuggestions(data: any) {
    const url = `${this.url}/api/sowjd/remove-vendors`;
    return this.http.post(url, data);
  }
  removeSkillSet(data: any) {
    const url = `${this.url}/api/sowjd/remove-skillset`;
    return this.http.post(url, data);
  }
  // technical questions
  getTechQuestions() {
    const url = `${this.url}/api/rfq/te-questions`;
    return this.http.get(url);
  }
  getsowjdRFQDetails(sowjdId: string) {
    const url = `${this.url}/api/rfq/${sowjdId}`;
    return this.http.get(url);
  }

  getVendorDetailOnRfqId(rfqId: string) {
    const url = `${this.url}/api/SowJdTechEvolution/get-sowjd-Vendor-Rfq-Details/${rfqId}`;
    return this.http.get(url);
  }

  getRFQQuestionsRatingDetails(rfqId: string) {
    const url = `${this.url}/api/SowJdTechEvolution/get-sowjd-technical-questions-ratings/${rfqId}`;
    return this.http.get(url);
  }

  getSowJdDetailsByRfqId(rfqId: string) {
    const url = `${this.url}/api/sowjd/sowjd-details-rfqId/${rfqId}`;
    return this.http.get(url);
  }

  getRFQRemarks(rfqId: string) {
    const url = `${this.url}/api/rfq/comments/${rfqId}/desc`;
    return this.http.get(url);
  }

  getVendorRFQQuestionsRatingDetails(rfqId: string) {
    const url = `${this.vendor_url}/api/vendors/get-sowjd-technical-questions-ratings/${rfqId}`;
    return this.http.get(url);
  }

  getVendorRFQRemarks(rfqId: string) {
    const url = `${this.vendor_url}/api/rfq/comments/${rfqId}/desc`;
    return this.http.get(url);
  }

  getAllVendorDocumentsBySowJdId(sowJdId: string) {
    return this.http.get(
      `${this.vendor_url}/api/OpenSowJd/sowjd-documents/${sowJdId}`
    );
  }

  getVendorSkillSet(sowJdId: string) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.vendor_url}/api/MySubmissions/sowjd-skillset/${sowJdId}`;
    return this.http.get(url, { params });
  }

  getVendorSignOffSkillSet(tpId: string) {
    const url = `${this.vendor_url}/api/techproposal/get-tpskillset/${tpId}`;
    return this.http.get(url);
  }

  getSignOffComments(tpId: string) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/my-Technical-proposal-remarks/${tpId}`;
    return this.http.get(url);
  }

  getInternalCostDetails(rfqId: string) {
    const url = `${this.url}/api/rfq/internal-cost/${rfqId}`;
    return this.http.get(url);
  }

  getWPInternalCostDetails(rfqId: string) {
    const url = `${this.url}/api/rfq/wpinternal-cost/${rfqId}`;
    return this.http.get(url);
  }

  getSignOffInternalCostDetails(tpId: string) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/internal-cost/${tpId}`;
    return this.http.get(url);
  }

  getSignOffWPInternalCostDetails(tpId: string) {
    const url = `${this.url}/api/rfq/wptpinternal-cost/${tpId}`;
    return this.http.get(url);
  }

  getPODetails(tpId: string) {
    const url = `${this.vendor_url}/api/techproposal/po-link-tp/${tpId}`;
    return this.http.get(url);
  }

  deleteSowjdRequestbyId(sowjdId: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/delete-sowjd/${sowjdId}`;
    return this.http.delete(url, { params });
  }
  postWithdrawSowjdRequest(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/sowjd-withdrawal`;
    return this.http.post(url, data, { params });
  }
  withdrawSowjdDetail(data: any) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    const url = `${this.url}/api/sowjd/validatesowjd-withdrawal`;
    return this.http.post(url, data, { params });
  }
  getSectionDepartmentByGroup(groudpCodeObj: any) {
    const url = `${this.url}/api/sowjd/section-department-bygroup`;
    return this.http.post(url, groudpCodeObj);
  }
  getDepartmentUserDetails(searchval: any) {
    const url = `${this.url}/api/sowjd/user-role-in-group`;
    return this.http.post(url, searchval);
  }
  getOnCompanyChange(companyid: any) {
    const url = `${this.url}/api/sowjd/sowjd-dd-on-company-change?companyId=${companyid}`;
    return this.http.get(url);
  }

  downloadTemplate() {
    const url = `${this.url}/api/sowjd/template/1`;
    return this.http.get(url);
  }

  getProposalDocuments(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-Vendor-documents/${rfqId}`
    );
  }

  //vendor signoff
  getVendorSignoffData() {
    return this.http.get(
      `${this.url}/api/SowJdTechnicalProposalController/my-Technical-proposal/desc`
    );
  }

  getVendorSignoffByIdvendorId(vendorId: string) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/my-Technical-proposal/${vendorId}`
    );
  }

  getResource(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-vendor-resources/${rfqId}`
    );
  }

  uploadProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/create-vendor-documents`,
      input
    );
  }
  getTechRating(sowjdId: any) {
    const url = `${this.url}/api/rfq/sowjd-rfq-details/${sowjdId}`;
    return this.http.get(url);
  }
  getSowjdSignOffDetails(sowjdId: any) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/my-Technicalproposal/${sowjdId}`;
    return this.http.get(url);
  }
  getSowjdSrnetails(sowjdId: any) {
    const url = `${this.url}/api/Srn/srn-list/${sowjdId}`;
    return this.http.get(url);
  }
  saveRfqtechEvaluation(technicalEvaluationObj: any) {
    const url = `${this.url}/api/rfq/save-rfq-technical-evolution-details`;
    return this.http.post(url, technicalEvaluationObj);
  }
  postRfqSubmitForm(data: object) {
    const url = `${this.url}/api/rfq/submit-rfq-technical-evolution`;
    return this.http.post(url, data);
  }
  postInitiateSignOffObjForm(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/initiate-signoff`;
    return this.http.post(url, data);
  }

  updateInitiateSignOffObjForm(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/UpdateTpSkillset`;
    return this.http.post(url, data);
  }

  postRfqSendBackForm(data: object) {
    const url = `${this.url}/api/rfq/send-back-rfq`;
    return this.http.post(url, data);
  }

  postSignOffSendBackForm(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/send-back-TP`;
    return this.http.post(url, data);
  }

  updateInvoiceNumber(invoiceObj: object) {
    const url = `${this.vendor_url}/api/srn/invoice`;
    return this.http.post(url, invoiceObj);
  }

  postSignOffRemarksForm(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/Technical-proposal-status-update`;
    return this.http.post(url, data);
  }

  postSignOfffWPShortClosure(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/UpdateWpShortClosureRequest`;
    return this.http.post(url, data);
  }

  postSignOfffResourceShortClosure(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/UpdateTpResourceShortClosureRequest`;
    return this.http.post(url, data);
  }

  withdrawSignoffdetail(data: object) {
    const url = `${this.url}/api/SowJdTechnicalProposalController/validatewithdraw-TP`;
    return this.http.post(url, data);
  }

  postRfqExtendDateForm(data: object) {
    const url = `${this.url}/api/rfq/extend-rfq`;
    return this.http.post(url, data);
  }

  postRfqWithdrowForm(data: object) {
    const url = `${this.url}/api/rfq/withdraw-rfq`;
    return this.http.post(url, data);
  }
  rfqWithdraw(data: object) {
    const url = `${this.url}/api/rfq/validatewithdraw-rfq`;
    return this.http.post(url, data);
  }

  // api/rfq/validatewithdraw-rfq

  //SOWJD SRN API

  getSowjdSRNDetails() {
    return this.http.get(`${this.url}/api/Srn/list`);
  }
  updateSrnStatus(data: object) {
    const url = `${this.url}/api/Srn/status-update`;
    return this.http.post(url, data);
  }
  getIntialUserList(searchValue: string) {
    if (searchValue)
      return this.http.get(
        `${this.url}/api/Srn/deligators?searchText=${searchValue}`
      );
    else return this.http.get(`${this.url}/api/Srn/deligators`);
  }
  delegateSRN(data: object) {
    const url = `${this.url}/api/Srn/deligate`;
    return this.http.post(url, data);
  }

  public postWithQueryString(
    endpoint: string,
    queryString: string
  ): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    const params = new HttpParams().set('query', queryString);
    return this.http.post(url, null, { params });
  }

  addNumberOfdays(startDate: Date, noOfDaysToAdd: number) {
    var endDate = new Date(),
      count = 0;
    while (count < noOfDaysToAdd) {
      endDate = new Date(startDate.setDate(startDate.getDate() + 1));
      if (endDate.getDay() != 0 && endDate.getDay() != 6) {
        count++;
      }
    }
    return endDate;
  }

  addNumberOfCalendardays(startDate: Date, noOfDaysToAdd: number) {
    var endDate = new Date(),
      count = 0;
    while (count < noOfDaysToAdd) {
      endDate = new Date(startDate.setDate(startDate.getDate() + 1));
      count++;
    }
    return endDate;
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  selectedResourcePlanRoles: any;
  selectedOnboardingRoles: any;
  selectedResourceMasterRoles: any;
  selectedDeboardingRoles: any;
  selectedChangeManagmentRoles: any;
  checkUserProfileValueValidForResourceModule() {
    const isVendor = JSON.parse(localStorage.getItem('isVendor'));
    if (!isVendor) {
      if (
        this.userProfileDetails &&
        this.userProfileDetails.hasOwnProperty('roleDetail')
      ) {
        const masterDataModulesRM =
          this.userProfileDetails.roleDetail[0].roleDetails.filter(
            (item: any) =>
              item.moduleDetails.some(
                (module: any) => module.moduleName === 'Resource'
              )
          );
        const masterDataFeatureDetailsRM = masterDataModulesRM.map(
          (item: any) => {
            const masterDataModuleRM = item.moduleDetails.find(
              (module: any) => module.moduleName === 'Resource'
            );
            return masterDataModuleRM.featureDetails;
          }
        );
        this.featureDetails = masterDataFeatureDetailsRM;
        this.selectedResourcePlanRoles = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        this.selectedOnboardingRoles = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        this.selectedResourceMasterRoles = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        this.selectedDeboardingRoles = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        this.selectedChangeManagmentRoles = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        for (let plan of this.featureDetails) {
          for (let item of plan) {
            if (item.featureCode?.toLowerCase() == 'resourceopenorder') {
              //start
              for (const permission in this.selectedResourcePlanRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedResourcePlanRoles[permission] = true;
                }
              }
              //end
              this.permissionDetailsResourcePlanOpenOrder =
                this.selectedResourcePlanRoles; // item.permissionDetails[0];
            }
            if (item.featureCode?.toLowerCase() == 'onboarding') {
              //start
              for (const permission in this.selectedOnboardingRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedOnboardingRoles[permission] = true;
                }
              }
              //end
              this.permissionDetailsOnboarding = this.selectedOnboardingRoles; // item.permissionDetails[0];
            }
            if (item.featureCode?.toLowerCase() == 'resource master') {
              //start
              for (const permission in this.selectedResourceMasterRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedResourceMasterRoles[permission] = true;
                }
              }
              //end
              this.permissionDetailsResourceMaster =
                this.selectedResourceMasterRoles; // item.permissionDetails[0];
            }
            if (item.featureCode?.toLowerCase() == 'deboarding') {
              //start
              for (const permission in this.selectedDeboardingRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedDeboardingRoles[permission] = true;
                }
              }
              //end
              this.permissionDetailsDeboarding = this.selectedDeboardingRoles; // item.permissionDetails[0];
            }
            if (item.featureCode?.toLowerCase() == 'change management') {
              //start
              for (const permission in this.selectedChangeManagmentRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedChangeManagmentRoles[permission] = true;
                }
              }
              //end
              this.permissionDetailsChangeManagement =
                this.selectedChangeManagmentRoles; // item.permissionDetails[0];
            }
          }
        }
        this.permissionsBehaviorSubjectResourcePlanOpenOrder.next(
          this.permissionDetailsResourcePlanOpenOrder
        );
        this.permissionsBehaviorSubjectOnboarding.next(
          this.permissionDetailsOnboarding
        );
        this.permissionsBehaviorSubjectResourceMaster.next(
          this.permissionDetailsResourceMaster
        );
        this.permissionsBehaviorSubjectDeboarding.next(
          this.permissionDetailsDeboarding
        );
        this.permissionsBehaviorSubjectChangeManagement.next(
          this.permissionDetailsChangeManagement
        );
      }
    }
  }
  getUserProfileRoleDetailResourcePlanOpenOrder() {
    return this.permissionsBehaviorSubjectResourcePlanOpenOrder.asObservable();
  }

  getUserProfileRoleDetailOnboarding() {
    return this.permissionsBehaviorSubjectOnboarding.asObservable();
  }

  getUserProfileRoleDetailResourceMaster() {
    return this.permissionsBehaviorSubjectResourceMaster.asObservable();
  }

  getUserProfileRoleDetailDeboarding() {
    return this.permissionsBehaviorSubjectDeboarding.asObservable();
  }
  getUserProfileRoleDetailChangeManagement() {
    return this.permissionsBehaviorSubjectChangeManagement.asObservable();
  }
}
