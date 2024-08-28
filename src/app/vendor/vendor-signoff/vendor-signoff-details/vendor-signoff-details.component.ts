import {
  Component,
  ViewChild,
  OnInit,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { HomeService } from 'src/app/services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import 'ag-grid-enterprise';
import { config } from '../../../config';
import { VendorService } from '../../services/vendor.service';
import { ReplaySubject } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { EditDeleteActionsComponent } from '../../shared/edit-delete-actions/edit-delete-actions.component';
import { DeleteComponent } from '../../delete/delete.component';
import { AddResourceRateCardTmComponent } from '../../BGSW/add-resource-rate-card-tm/add-resource-rate-card-tm.component';
import { AddResourceNoNRateCardTMComponent } from '../../BGSW/add-resource-rate-card-tm/add-resource-non-rate-card-tm/add-resource-non-rate-card-tm.component';
import { AddActivityNonRateCardWpComponent } from '../../BGSV/add-activity-non-rate-card-wp/add-activity-non-rate-card-wp.component';
import { AddActivityRateCardWpComponent } from '../../BGSV/add-activity-rate-card-wp/add-activity-rate-card-wp.component';
import { AddResourceRateCardWpComponent } from '../../BGSW/add-resource-rate-card-wp/add-resource-rate-card-wp.component';
import { TpSubmitRemarksComponent } from '../tp-submit-remarks/tp-submit-remarks.component';
import { CommonSignoffComponent } from 'src/app/dm/sowjdmodule/sowjd-signoff/sowjd-signoff-detail/common-signoff/common-signoff.component';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { LoaderService } from 'src/app/services/loader.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { PoStatusComponent } from 'src/app/dm/sowjdmodule/sowjd-signoff/sowjd-signoff-detail/po-status/po-status.component';
import { ErrorMessageComponent } from 'src/app/popup/error-message/error-message.component';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';
// import html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-vendor-signoff-details',
  templateUrl: './vendor-signoff-details.component.html',
  styleUrls: ['./vendor-signoff-details.component.scss'],
})
export class VendorSignoffDetailsComponent {
  dateFormat = config.dateFormat;
  private sub: any;
  sowJdId: string = '';
  tpId: string;
  signoffDetail: any;
  actionType: string = '';
  documentsList: any;
  recommendedVendorsList: any[] = [];
  vendorSuggestionData: any;
  approvedStatusData: any;
  sowjdDHActions: any;
  skillsetData: any;
  public dialogConfig: any;
  vendorDetail: any;
  proposalDocuments: any;
  resourceList: any[] = [];
  tpEquivalentResponse: any;
  workPackageList: any[] = [];
  getTpWorkPackage: any;
  vendorSignoffRemarks = [];
  isSignOffRecordeLocked: boolean = false;
  checkSignOffDateMessage: string;
  columnApiPO: any;
  private gridApi!: GridApi;
  private gridApiPO!: GridApi;
  private gridApiWP!: GridApi;
  private gridApiSkillset!: GridApi;
  rowDataSkillset: any = [];
  columnApiSkillset: any;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  public columnDefsResourceBGSWRateCardTM = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No.of Resource',
      hide: false,
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      hide: false,
      field: 'duration',
    },
    {
      headerName: 'Unit of Measurement',
      hide: false,
      field: 'unitOfMeasurement',
    },
    {
      headerName: 'Total Quantity',
      hide: false,
      field: 'totalQuantity',
    },
    {
      headerName: 'Unit Price',
      hide: false,
      field: 'unitPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Price',
      hide: false,
      field: 'price',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      hide: false,
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Onboarded Resource',
      hide: false,
      field: 'resourceOnboardCompleted',
    },
    {
      headerName: 'Onboarding Completed',
      hide: false,
      field: 'isOnboardingCompleted',
      cellRenderer: (params) =>
        params.data.isOnboardingCompleted ? 'Yes' : 'No',
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              this.loaderService.setShowLoading();
              let input = { id: params.data.id };
              this.vendorService.deleteResource(input).subscribe(
                (response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);

                    this.getResurces();
                    this.gridApi?.setRowData(this.resourceList);
                  }
                },
                (error) => {
                  this.loaderService.setDisableLoading();
                }
              );
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

  public columnDefsResource = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No.of Resource',
      hide: false,
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      hide: false,
      field: 'duration',
    },
    {
      headerName: 'Unit of Measurement',
      hide: false,
      field: 'unitOfMeasurement',
    },
    {
      headerName: 'Total Quantity',
      hide: false,
      field: 'totalQuantity',
    },
    {
      headerName: 'Unit Price',
      hide: false,
      field: 'unitPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Price',
      hide: false,
      field: 'price',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      hide: false,
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              this.loaderService.setShowLoading();
              let input = { id: params.data.id };
              this.vendorService.deleteResource(input).subscribe(
                (response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getResurces();
                    this.gridApi?.setRowData(this.resourceList);
                  }
                },
                (error) => {
                  this.loaderService.setDisableLoading();
                }
              );
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

  public columnDefsSkillsetsTAM = [
    {
      headerName: 'SkillSet',
      field: 'skillset',
    },
    {
      headerName: 'Grade',
      field: 'grade',
    },
    {
      headerName: 'SOW JD Demand (No. of resources)',
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      field: 'duration',
    },
    {
      headerName: 'Unit Of Measurement',
      field: 'uom',
    },
    {
      headerName: 'PMO',
      field: 'pmo',
    },
    {
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
      resizable: false,
    },
    {
      headerName: 'Action',
      colId: 'action',
      cellRenderer: this.renderActionBVendorResourcePlan.bind(this),
      resizable: false,
    },
  ];

  renderActionBVendorResourcePlan() {
    let iconsHTML = ' <div><a class="icon-class">';
    iconsHTML +=
      '<span class="add-resource icon"></span><span class="vendor_resource_plan">Add Resource Plan</span></a></div>';
    return iconsHTML;
  }

  onCellClicked(params: any): void {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'vendor_resource_plan'
    ) {
      if (
        this.signoffDetail.outSourcingCode === 'TAM' &&
        this.signoffDetail.sowjdTypeCode === 'RC'
      ) {
        this.addBGSWRateCardTMResource(params.data);
      } else if (
        this.signoffDetail.outSourcingCode === 'TAM' &&
        this.signoffDetail.sowjdTypeCode === 'NRC'
      ) {
        this.addBGSWNoNRateCardTMResource(params.data);
      }
    }
  }

  public columnDefsWorkPackageBGSVRateCardWP = [
    {
      headerName: 'Project Name',
      hide: false,
      field: 'projectName',
    },
    {
      headerName: 'Activity Type',
      hide: false,
      field: 'activityType',
    },
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillsetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No. of Activity Planned',
      hide: false,
      field: 'noofActivityPlanned',
    },
    {
      headerName: 'Estimation(hrs)/Activity',
      hide: false,
      field: 'estimationPerActivity',
    },
    {
      headerName: 'Total Hours',
      hide: false,
      field: 'totalHours',
    },
    {
      headerName: 'Price/Hr',
      hide: false,
      field: 'unitPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Price/Activity',
      hide: false,
      field: 'pricePerActivity',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.pricePerActivity,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Price',
      hide: false,
      field: 'totalPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Delivery Completed',
      field: 'isDeliveryCompleted',
      hide: false,
      cellRenderer: (params) =>
        params.data.isDeliveryCompleted ? 'Yes' : 'No',
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        delete: (params: any) => {
          if (this.resourceList.length !== 0) {
            this.notifyservice.alert(
              'You cannot delete work packages when resources are exists'
            );
            return false;
          }
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              this.loaderService.setShowLoading();
              let input = { workPackageId: params.data.id };
              this.vendorService.deleteWorkPackage(input).subscribe(
                (response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getWorkPackage();
                    this.gridApiWP?.setRowData(this.workPackageList);
                  }
                },
                (error) => {
                  this.loaderService.setDisableLoading();
                }
              );
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

  public columnDefsResourceRateCardWP = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No.of Resource',
      hide: false,
      field: 'quantity',
    },
    {
      headerName: 'Resource Onboarding Date',
      hide: false,
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Onboarded Resource',
      hide: false,
      field: 'resourceOnboardCompleted',
    },
    {
      headerName: 'Onboarding Completed',
      hide: false,
      field: 'isOnboardingCompleted',
      cellRenderer: (params) =>
        params.data.isOnboardingCompleted ? 'Yes' : 'No',
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              this.loaderService.setShowLoading();
              let input = { id: params.data.id };
              this.vendorService.deleteResource(input).subscribe(
                (response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getResurces();
                    this.gridApi?.setRowData(this.resourceList);
                  }
                },
                (error) => {
                  this.loaderService.setDisableLoading();
                }
              );
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];
  public columnDefsPO = [
    {
      headerName: 'Purchase Order',
      hide: false,
      field: 'poNumber',
    },
    {
      headerName: 'Company',
      hide: false,
      field: 'companyCode',
    },
    {
      headerName: 'Location',
      hide: false,
      field: 'location',
    },
    {
      headerName: 'Vendor ID',
      hide: false,
      field: 'vendorSAPID',
    },
    {
      headerName: 'Vendor Name',
      hide: false,
      field: 'vendorName',
    },
    {
      headerName: 'Start Date',
      hide: false,
      field: 'validityStart',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'End Date',
      hide: false,
      field: 'validityEnd',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Status',
      hide: false,
      field: 'isDeleted',
      suppressMenu: true,
      cellRenderer: PoStatusComponent,
    },
  ];
  autoGroupColumnDef: ColDef = { minWidth: 200 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 200,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };

  VendorPOList: any;
  columnApiVSPOne: any;
  columnApiVSPTwo: any;
  columnApiVSPThree: any;
  columnApiVSPFour: any;

  columnApiWPOne: any;
  columnApiWPTwo: any;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private notifyservice: NotifyService,
    private location: Location,
    private loaderService: LoaderService,
    private sowjdService: sowjdService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.tpId = params['tpId'];
      if (this.tpId) {
        this.getVendorSignoffDetail();
        this.getVendorSignoffComments();
        this.getPODetails();
      }
    });
  }

  getPODetails() {
    this.sowjdService.getPODetails(this.tpId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.VendorPOList = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
  getPurchaseOrder(params: GridReadyEvent) {
    this.gridApiPO = params.api;
    this.columnApiPO = params.columnApi;
    this.gridApiPO.refreshCells({ force: true });
    this.gridApiPO.setDomLayout('autoHeight');
    this.gridApiPO.hideOverlay();
    if (
      this.VendorPOList == null ||
      this.VendorPOList == undefined ||
      this.VendorPOList.length <= 0
    )
      this.gridApiPO.showNoRowsOverlay();
    this.gridApiPO.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiPO.hideOverlay();
    this.adjustAll();
  }

  commonSignOff(type: string) {
    let dialogRef = this.dialog.open(CommonSignoffComponent, {
      width: '40vw',
      data: {
        tpId: this.tpId,
        type,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  successMessage(message: string) {
    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '500px',
      height: 'auto',
      data: message,
    });
    return dialogRef;
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApiSkillset = params.api;
    this.gridApiSkillset.setDomLayout('autoHeight');

    this.columnApiSkillset = params.columnApi;

    this.gridApiSkillset.refreshCells({ force: true });
    this.gridApiSkillset.hideOverlay();
    if (
      this.rowDataSkillset == null ||
      this.rowDataSkillset == undefined ||
      this.rowDataSkillset.length <= 0
    )
      this.gridApiSkillset.showNoRowsOverlay();
    this.gridApiSkillset.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiSkillset.hideOverlay();

    this.adjustWidthSkill();
  }

  adjustWidthSkill() {
    const allColumnIds: any = [];
    this.columnApiSkillset?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiSkillset?.autoSizeColumns(allColumnIds, false);
  }

  vendorResourceGridReady(params: GridReadyEvent, type: number) {
    this.gridApi = params.api;
    this.columnApiVSPTwo = params.columnApi;
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.resourceList == null ||
      this.resourceList == undefined ||
      this.resourceList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustAll();
  }

  workPackageGridReady(params: GridReadyEvent, type: number) {
    this.gridApiWP = params.api;
    this.gridApiWP.setDomLayout('autoHeight');
    this.gridApi = params.api;
    this.columnApiWPTwo = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.workPackageList == null ||
      this.workPackageList == undefined ||
      this.workPackageList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustAll();
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  onproposalFileChanged(event: any) {
    this.loaderService.setShowLoading();
    let EventFile = event.target.files[0];
    var fileExt = EventFile.name;
    var validExts = new Array('.doc', '.docx', '.pdf', '.xlsx', '.xls');
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0 && fileExt != '') {
      this.notifyservice.alert(
        'Supported Formats: ' + validExts.toString() + ' upto 10 MB.'
      );
      this.loaderService.setDisableLoading();
      return false;
    }
    var totalBytes = EventFile.size;
    let sizeOfFile;
    if (totalBytes < 1000000) {
      sizeOfFile = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      sizeOfFile = Math.floor(totalBytes / 1000000); //+ 'MB';
      if (sizeOfFile > 10) {
        this.notifyservice.alert(
          'Your File Size is ' + sizeOfFile + ' MB, File Size must be max 10MB'
        );
        this.loaderService.setDisableLoading();
        return false;
      }
    }

    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        technicalProposalId: this.tpId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.vendorService.uploadProposalDocuments(input).subscribe(
        (response: any) => {
          if (response.status == 'success') {
            this.loaderService.setDisableLoading();
            this.getProposalDocuments();
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
        }
      );
    });
  }

  getProposalDocuments() {
    this.vendorService
      .getProposalDocuments(this.tpId)
      .subscribe((response: any) => {
        this.proposalDocuments = response;
      });
  }

  deleteFile(id: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        this.loaderService.setShowLoading();
        let input = { id: id };
        this.vendorService.deleteProposalDocuments(input).subscribe(
          (response: any) => {
            if (response.data[0].isSuccess) {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert(response.data[0].message);
              this.getProposalDocuments();
            }
          },
          (error) => {
            this.loaderService.setDisableLoading();
          }
        );
      }
    });
  }

  addBGSWRateCardTMResource(sowjdSkillSets: any) {
    const dialogRef = this.dialog.open(AddResourceRateCardTmComponent, {
      width: '50vw',
      data: {
        id: this.tpId,
        flag: 1,
        sowjdSkillSets,
        resourceList: this.resourceList,
        endDate: this.signoffDetail.endDate,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Vendor resource added successful.');
        this.getResurces();
        this.gridApi?.setRowData(this.resourceList);
      }
    });
  }

  addBGSWNoNRateCardTMResource(sowjdSkillSets: any) {
    const dialogRef = this.dialog.open(AddResourceNoNRateCardTMComponent, {
      width: '50vw',
      data: {
        id: this.tpId,
        flag: 1,
        sowjdSkillSets,
        resourceList: this.resourceList,
        endDate: this.signoffDetail.endDate,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Vendor resource added successful.');
        this.getResurces();
        this.gridApi?.setRowData(this.resourceList);
      }
    });
  }

  addBGSVNoNRateCardWPWorkPackage() {
    const dialogRef = this.dialog.open(AddActivityNonRateCardWpComponent, {
      width: '50vw',
      data: {
        id: this.tpId,
        flag: 1,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Work package added successful.');
        this.getWorkPackage();
        this.gridApiWP?.setRowData(this.workPackageList);
      }
    });
  }

  addBGSVRateCardWPResource() {
    const dialogRef = this.dialog.open(AddResourceRateCardWpComponent, {
      width: '50vw',
      data: {
        id: this.tpId,
        flag: 1,
        workPackageList: this.workPackageList,
        endDate: this.signoffDetail.endDate,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Vendor resource added successful.');
        this.getResurces();
        this.gridApi?.setRowData(this.resourceList);
      }
    });
  }

  addBGSVRateCardWPWorkPackage() {
    const dialogRef = this.dialog.open(AddActivityRateCardWpComponent, {
      width: '50vw',
      data: {
        id: this.tpId,
        flag: 1,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Work package added successful.');
        this.getWorkPackage();
        this.gridApiWP?.setRowData(this.workPackageList);
      }
    });
  }

  getWorkPackage() {
    this.vendorService.getWorkPackage(this.tpId).subscribe((response: any) => {
      if (response.data != null) {
        this.workPackageList = response.data.tpWorkPackage;
        this.getTpWorkPackage = response.data.getTpWorkPackage;
        this.gridApiWP?.setRowData(this.workPackageList);
        this.adjustAll();
      }
    });
  }

  getResurces() {
    this.vendorService.getResource(this.tpId).subscribe((response: any) => {
      if (response?.data != null) {
        this.resourceList = response.data.getTPResources;
        this.tpEquivalentResponse = response.data.tpEquivalentResponse;
        this.gridApi?.setRowData(this.resourceList);
        this.adjustAll();
      }
    });
  }

  getVendorSignoffDetail() {
    this.loaderService.setShowLoading();
    if (this.tpId) {
      this.vendorService
        .getSignoffDetailByTpId(this.tpId)
        .subscribe((res: any) => {
          if (res) {
            this.loaderService.setDisableLoading();
            this.signoffDetail = res.data.technicalProposalDetails[0];

            this.companyCurrencyName = this.signoffDetail?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (
              this.signoffDetail.tpStatusID === 1 ||
              this.signoffDetail.tpStatusID === 3
            ) {
              if (
                new Date(this.signoffDetail.tpEndDate).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0)
              ) {
                this.isSignOffRecordeLocked = true;
                this.checkSignOffDateMessage =
                  'Technical Proposal End Date is over, record is locked';
              } else {
                this.isSignOffRecordeLocked = false;
              }
            }

            if (
              !(
                this.signoffDetail.tpStatusID === 1 ||
                this.signoffDetail.tpStatusID === 3
              )
            ) {
              this.columnDefsResourceBGSWRateCardTM = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Quantity',
                  hide: false,
                  field: 'duration',
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  field: 'unitOfMeasurement',
                },
                {
                  headerName: 'Total Quantity',
                  hide: false,
                  field: 'totalQuantity',
                },
                {
                  headerName: 'Unit Price',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'price',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'Onboarded Resource',
                  hide: false,
                  field: 'resourceOnboardCompleted',
                },
                {
                  headerName: 'Onboarding Completed',
                  hide: false,
                  field: 'isOnboardingCompleted',
                  cellRenderer: (params) =>
                    params.data.isOnboardingCompleted ? 'Yes' : 'No',
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
              this.columnDefsResource = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Quantity',
                  hide: false,
                  field: 'duration',
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  field: 'unitOfMeasurement',
                },
                {
                  headerName: 'Total Quantity',
                  hide: false,
                  field: 'totalQuantity',
                },
                {
                  headerName: 'Unit Price',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'price',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
              ];
              this.columnDefsResourceRateCardWP = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'Onboarded Resource',
                  hide: false,
                  field: 'resourceOnboardCompleted',
                },
                {
                  headerName: 'Onboarding Completed',
                  hide: false,
                  field: 'isOnboardingCompleted',
                  cellRenderer: (params) =>
                    params.data.isOnboardingCompleted ? 'Yes' : 'No',
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
              this.columnDefsSkillsetsTAM = [
                {
                  headerName: 'SkillSet',
                  field: 'skillset',
                },
                {
                  headerName: 'Grade',
                  field: 'grade',
                },
                {
                  headerName: 'SOW JD Demand (No. of resources)',
                  field: 'quantity',
                },
                {
                  headerName: 'Quantity',
                  field: 'duration',
                },
                {
                  headerName: 'Unit Of Measurement',
                  field: 'uom',
                },
                {
                  headerName: 'PMO',
                  field: 'pmo',
                },
                {
                  headerName: 'Resource Onboarding Date',
                  cellRenderer: DateFormatComponent,
                  field: 'resourceOnboardingDate',
                  resizable: false,
                },
              ];
              this.columnDefsWorkPackageBGSVRateCardWP = [
                {
                  headerName: 'Project Name',
                  hide: false,
                  field: 'projectName',
                },
                {
                  headerName: 'Activity Type',
                  hide: false,
                  field: 'activityType',
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillsetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No. of Activity Planned',
                  hide: false,
                  field: 'noofActivityPlanned',
                },
                {
                  headerName: 'Estimation(hrs)/Activity',
                  hide: false,
                  field: 'estimationPerActivity',
                },
                {
                  headerName: 'Total Hours',
                  hide: false,
                  field: 'totalHours',
                },
                {
                  headerName: 'Price/Hr',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Price/Activity',
                  hide: false,
                  field: 'pricePerActivity',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.pricePerActivity,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'totalPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.totalPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Delivery Completed',
                  field: 'isDeliveryCompleted',
                  hide: false,
                  cellRenderer: (params) =>
                    params.data.isDeliveryCompleted ? 'Yes' : 'No',
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
            }
            this.vendorDetail = res.data.vendorInfo[0];

            if (this.signoffDetail.sowJdId) {
              this.getSowjdDocuments();
              this.getVendorSignOffSkillSet();
            }

            this.getSowjdDocuments();
            this.getProposalDocuments();
            this.getResurces();
            this.getWorkPackage();
          }
        });
    }
  }

  getVendorSignOffSkillSet() {
    this.loaderService.setShowLoading();
    this.sowjdService.getVendorSignOffSkillSet(this.tpId).subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.rowDataSkillset = res.data;
        this.gridApiSkillset.setRowData(this.rowDataSkillset);
        this.adjustWidthSkill();
      },
      error: (e) => {
        console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }

  getSowjdDocuments() {
    this.vendorService
      .getAllDocumentsBySowJdId(this.signoffDetail.sowJdId)
      .subscribe((res: any) => {
        this.documentsList = res;
      });
  }

  getVendorSignoffComments() {
    this.vendorService.getVendorSignoffRemarks(this.tpId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.vendorSignoffRemarks = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  cancel() {
    this.location.back();
  }

  popMessage(title: string, message: string) {
    this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
  }
  errorMessage(skillSet: any[], resource: any[]) {
    const dialogRef = this.dialog.open(ErrorMessageComponent, {
      width: '50vw',
      height: 'auto',
      data: { skillSet, resource },
    });
    return dialogRef;
  }

  submitTP() {
    if (this.proposalDocuments?.data.length === 0) {
      this.notifyservice.alert('Please add minimum one proposal document');
      return;
    }

    if (this.signoffDetail.outSourcingCode === 'TAM') {
      if (this.resourceList.length === 0) {
        this.notifyservice.alert('Please add minimum one resource to submit');
        return;
      }

      const resourceList = this.resourceList.reduce((acc, current) => {
        const x = acc.find(
          (item) => item.sowjdSkillsetId === current.sowjdSkillsetId
        );
        if (!x) {
          const newCurr = {
            id: current.id,
            skillSetID: current.skillSetID,
            gradeID: current.gradeID,
            quantity: current.quantity,
            unitPrice: current.unitPrice,
            unitOfMeasurement: current.unitOfMeasurement,
            resourceOnboardingDate: current.resourceOnboardingDate,
            pmo: current.pmo,
            price: current.price,
            duration: current.duration,
            skillSetName: current.skillSetName,
            gradeName: current.gradeName,
            sowjdSkillsetId: current.sowjdSkillsetId,
          };
          return acc.concat([newCurr]);
        } else {
          var obj = {};
          Object.keys(x).forEach(function (a) {
            // obj[a] = x[a] + current[a]; // for all object properties
            obj['id'] = x['id'];
            obj['skillSetID'] = x['skillSetID'];
            obj['gradeID'] = x['gradeID'];
            obj['quantity'] = +x['quantity'] + +current['quantity'];
            obj['duration'] = x['duration'];
            obj['unitPrice'] = x['unitPrice'];
            obj['resourceOnboardingDate'] = x['resourceOnboardingDate'];
            obj['unitOfMeasurement'] = x['unitOfMeasurement'];
            obj['price'] = x['price'];
            obj['pmo'] = x['pmo'];
            obj['gradeName'] = x['gradeName'];
            obj['skillSetName'] = x['skillSetName'];
            obj['sowjdSkillsetId'] = x['sowjdSkillsetId'];
          });
          acc.splice(acc.indexOf(x), 1, obj);
          return acc;
        }
      }, []);

      let isValuesMatched = false;
      let isValuesMatchedTest = false;
      let skillsetsErrorObject = [];
      let resourceErrorObject = [];
      this.rowDataSkillset.filter((skillsets) => {
        const found = resourceList.some(
          (el) => el.sowjdSkillsetId === skillsets.id
        );

        if (!found) {
          if (!isValuesMatchedTest) {
            isValuesMatchedTest = true;
          }
        }

        resourceList.some((resource) => {
          if (skillsets.id === resource.sowjdSkillsetId) {
            if (skillsets.quantity !== resource.quantity) {
              if (!isValuesMatched) {
                skillsetsErrorObject.push(skillsets);
                resourceErrorObject.push(resource);
                isValuesMatched = true;
              }
            }
          }
        });
      });
      this.gridApiSkillset.setRowData(this.rowDataSkillset);
      this.adjustWidthSkill();

      if (isValuesMatchedTest) {
        this.notifyservice.alert(
          'Please complete resource plan for all skillset and grade combination in SoW JD Demand details'
        );
        return;
      }

      if (isValuesMatched) {
        const dialogRef = this.errorMessage(
          skillsetsErrorObject,
          resourceErrorObject
        );
        dialogRef.afterClosed().subscribe((result: any) => {});
        return;
      }
    } else if (
      this.signoffDetail.outSourcingCode === 'WP' ||
      this.signoffDetail.outSourcingCode === 'MS'
    ) {
      if (this.workPackageList.length === 0) {
        this.notifyservice.alert(
          'Please add minimum one work package to submit'
        );
        return;
      }
      if (this.resourceList.length === 0) {
        this.notifyservice.alert('Please add minimum one resource to submit');
        return;
      }

      const uniqueWorkPackages = this.workPackageList.filter(
        (object, index, self) => {
          return (
            index ===
            self.findIndex(
              (o) =>
                o.skillSetId === object.skillSetId &&
                o.gradeId === object.gradeId
            )
          );
        }
      );

      const uniqueResources = this.resourceList.filter(
        (object, index, self) => {
          return (
            index ===
            self.findIndex(
              (o) =>
                o.skillSetID === object.skillSetID &&
                o.gradeID === object.gradeID
            )
          );
        }
      );

      if (uniqueWorkPackages.length !== uniqueResources.length) {
        this.notifyservice.alert(
          'Please complete resource plan for all skillset and grade combination in workpackage details'
        );
        return;
      }
    }
    let dialogRef = this.dialog.open(TpSubmitRemarksComponent, {
      width: '30vw',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        this.loaderService.setShowLoading();
        let tpSubmitObj = {
          sowJdId: this.signoffDetail.sowJdId,
          technicalProposalId: this.tpId,
          remarks: res.remarks,
          isSubmitted: true,
        };
        this.vendorService.submitTechnicalProposal(tpSubmitObj).subscribe(
          (response: any) => {
            if (response.data != null) {
              if (response.data[0].isSuccess) {
                this.loaderService.setDisableLoading();
                const dialogRef = this.successMessage(response.data[0].message);
                dialogRef.afterClosed().subscribe((result: any) => {
                  this.ngOnInit();
                });
              }
            }
          },
          (error) => {
            this.loaderService.setDisableLoading();
          }
        );
      }
    });
  }

  @ViewChild('pdfElement') pdfEl!: ElementRef;
  isPDF: boolean = false;
  optionPDFs = {
    margin: 0.1,
    filename: 'Signoff_Document.pdf',
    image: {
      type: 'jpeg',
      quality: '0.98',
    },
    html2canvas: {
      scale: 2.5,
    },

    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait',
    },
  };

  // exportPDFdownload() {
  //   this.isPDF = true;
  //   this.loaderService.setShowLoading();
  //   const pEl = document.getElementById('pEl');
  //   html2pdf().from(pEl).set(this.optionPDFs).save();
  //   setTimeout(() => {
  //     this.loaderService.setDisableLoading();
  //     this.isPDF = false;
  //   }, 10);
  // }

  onFirstDataRendered(event: any) {
    this.adjustAll();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustAll();
    }, 500);
  }
  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustAll();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustAll();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustAll();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustAll();
  }

  adjustAll() {
    const allColumnIdsPO: any = [];
    if (this.columnApiPO) {
      this.columnApiPO.getColumns().forEach((column: any) => {
        allColumnIdsPO.push(column.getId());
      });
      this.columnApiPO.autoSizeColumns(allColumnIdsPO, false);
    }

    const allColumnIds: any = [];
    this.columnApiVSPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPTwo?.autoSizeColumns(allColumnIds, false);

    const allColumnIdsWP: any = [];
    this.columnApiWPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIdsWP.push(column.getId());
    });
    this.columnApiWPTwo?.autoSizeColumns(allColumnIdsWP, false);
  }
}
