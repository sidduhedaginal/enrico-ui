import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { HomeService } from 'src/app/services/home.service';
import { MatDialog } from '@angular/material/dialog';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridApi,
  ColDef,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { Observable } from 'rxjs';
import 'ag-grid-enterprise';
import { config } from '../../../config';
import { VendorService } from '../../services/vendor.service';
import { SowjdDetailsService } from '../../services/sowjd-details.service';
import { ReplaySubject } from 'rxjs';
import { DeleteComponent } from '../../delete/delete.component';
import { AddResourceNoNRateCardTMComponent } from '../../BGSW/add-resource-rate-card-tm/add-resource-non-rate-card-tm/add-resource-non-rate-card-tm.component';
import { EditDeleteActionsComponent } from '../../shared/edit-delete-actions/edit-delete-actions.component';
import { AddResourceRateCardTmComponent } from '../../BGSW/add-resource-rate-card-tm/add-resource-rate-card-tm.component';
import { AddActivityRateCardWpComponent } from '../../BGSV/add-activity-rate-card-wp/add-activity-rate-card-wp.component';
import { AddActivityNonRateCardWpComponent } from '../../BGSV/add-activity-non-rate-card-wp/add-activity-non-rate-card-wp.component';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { AddResourceRateCardWpComponent } from '../../BGSW/add-resource-rate-card-wp/add-resource-rate-card-wp.component';
import { RfqRemarksComponent } from '../rfq-remarks/rfq-remarks.component';
import { LoaderService } from 'src/app/services/loader.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { ErrorMessageComponent } from 'src/app/popup/error-message/error-message.component';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-vendor-rfq-detail',
  templateUrl: './vendor-rfq-detail.component.html',
  styleUrls: ['./vendor-rfq-detail.component.scss'],
})
export class VendorRfqDetailComponent implements OnInit {
  dateFormat = config.dateFormat;
  private sub: any;
  sowJdId: string = '';
  rfqId: string;
  rfqDetail: any;
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
  workPackageList: any[] = [];
  rfqRemarks = [];
  resourceSummary: any;
  workPackageSummary: any;
  rfqQuestionRating: any;
  isRFQRecordeLocked: boolean = false;
  checkRFQDateMessage: string;
  rowDataVendorSkillset: any;
  columnApiSkillset: any;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private vendorService: VendorService,
    private sowjdDetailsService: SowjdDetailsService,
    private sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.rfqId = params['rfqId'];
      if (this.rfqId) {
        this.getRFQDetail();
        this.getRFQQuestionsRating();
        this.getRFQComments();
      }
    });
  }

  getRFQQuestionsRating() {
    this.sowjdService.getVendorRFQQuestionsRatingDetails(this.rfqId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.rfqQuestionRating = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getRFQComments() {
    this.sowjdService.getVendorRFQRemarks(this.rfqId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.rfqRemarks = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  public columnDefsSkillsetsTAM = [
    {
      headerName: 'SkillSet',
      field: 'skillsetName',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
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
        this.rfqDetail.outSourcingCode === 'TAM' &&
        this.rfqDetail.sowjdTypeCode === 'RC'
      ) {
        this.addBGSWRateCardTMResource(params.data);
      } else if (
        this.rfqDetail.outSourcingCode === 'TAM' &&
        this.rfqDetail.sowjdTypeCode === 'NRC'
      ) {
        this.addBGSWNoNRateCardTMResource(params.data);
      }
    }
  }

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
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
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
              this.sowjdDetailsService
                .deleteResource(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getResurces();
                  }
                });
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
              this.sowjdDetailsService
                .deleteResource(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getResurces();
                  }
                });
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];
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
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
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
              this.sowjdDetailsService
                .deleteResource(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);
                    this.getResurces();
                  }
                });
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

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
      field: 'estimationActivity',
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
              this.sowjdDetailsService
                .deleteWorkPackage(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.loaderService.setDisableLoading();
                    this.notifyservice.alert(response.data[0].message);

                    this.getWorkPackage();
                  }
                });
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

  errorMessage(skillSet: any[], resource: any[]) {
    const dialogRef = this.dialog.open(ErrorMessageComponent, {
      width: '50vw',
      height: 'auto',
      data: { skillSet, resource },
    });
    return dialogRef;
  }

  successMessage(message: string) {
    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '500px',
      height: 'auto',
      data: message,
    });
    return dialogRef;
  }
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
  columnApiVSPOne: any;
  columnApiVSPTwo: any;
  columnApiVSPThree: any;
  columnApiVSPFour: any;

  columnApiWPOne: any;
  columnApiWPTwo: any;
  public rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  private gridApiVendor!: GridApi;
  private gridApiWP!: GridApi;

  addBGSWRateCardTMResource(sowjdSkillSets: any) {
    const dialogRef = this.dialog.open(AddResourceRateCardTmComponent, {
      width: '50vw',
      data: {
        id: this.rfqId,
        sowjdSkillSets,
        resourceList: this.resourceList,
        endDate: this.rfqDetail.endDate,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Vendor resource added successful.');
        this.getResurces();
      }
    });
  }

  addBGSWNoNRateCardTMResource(sowjdSkillSets: any) {
    const dialogRef = this.dialog.open(AddResourceNoNRateCardTMComponent, {
      width: '50vw',
      data: {
        id: this.rfqId,
        sowjdSkillSets,
        resourceList: this.resourceList,
        endDate: this.rfqDetail.endDate,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Vendor resource added successful.');
        this.getResurces();
      }
    });
  }

  addBGSVRateCardWPResource() {
    if (this.workPackageList.length > 0) {
      const dialogRef = this.dialog.open(AddResourceRateCardWpComponent, {
        width: '50vw',
        data: {
          id: this.rfqId,
          workPackageList: this.workPackageList,
          endDate: this.rfqDetail.endDate,
        },
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (res.data) {
          this.notifyservice.alert('Vendor resource added successful.');
          this.getResurces();
        }
      });
    } else {
      this.notifyservice.alert('Please add work package');
    }
  }

  addBGSVRateCardWPWorkPackage() {
    const dialogRef = this.dialog.open(AddActivityRateCardWpComponent, {
      width: '50vw',
      data: {
        id: this.rfqId,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Work package added successful.');
        this.getWorkPackage();
      }
    });
  }

  addBGSVNoNRateCardWPWorkPackage() {
    const dialogRef = this.dialog.open(AddActivityNonRateCardWpComponent, {
      width: '50vw',
      data: {
        id: this.rfqId,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.notifyservice.alert('Work package added successful.');
        this.getWorkPackage();
      }
    });
  }

  submitRFQ() {
    if (this.proposalDocuments?.data.length === 0) {
      this.notifyservice.alert('Please add minimum one proposal document');
      return;
    }

    if (this.rfqDetail.outSourcingCode === 'TAM') {
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
      this.rowDataVendorSkillset.filter((skillsets) => {
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
              // if (!isValuesMatched) {
              skillsetsErrorObject.push(skillsets);
              resourceErrorObject.push(resource);
              isValuesMatched = true;
              // }
            }
          }
        });
      });
      this.gridApiVendor.setRowData(this.rowDataVendorSkillset);
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
      this.rfqDetail.outSourcingCode === 'WP' ||
      this.rfqDetail.outSourcingCode === 'MS'
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

    let dialogRef = this.dialog.open(RfqRemarksComponent, {
      width: '30vw',
      data: 'Submit RFQ',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        this.loaderService.setShowLoading();
        let rfqSubmitObj = {
          sowJdId: this.rfqDetail.sowJdId,
          rfqId: this.rfqId,
          remarks: res.remarks,
          isSubmitted: true,
        };
        this.sowjdDetailsService
          .sowstatatussaveOrSubmit(rfqSubmitObj)
          .subscribe(
            (response: any) => {
              if (response.data != null) {
                if (response.data[0].isSuccess) {
                  this.loaderService.setDisableLoading();
                  const dialogRef = this.successMessage(
                    response.data[0].message
                  );
                  dialogRef.afterClosed().subscribe((result: any) => {
                    this.ngOnInit();
                  });
                }
              }
            },
            (error) => {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert(
                error.error.data.errorDetails[0].errorCode
              );
            }
          );
      }
    });
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
    let EventFile = event.target.files[0];
    var fileExt = EventFile.name;
    var validExts = new Array('.doc', '.docx', '.pdf', '.xlsx', '.xls');
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0 && fileExt != '') {
      this.notifyservice.alert(
        'Supported Formats: ' + validExts.toString() + ' upto 10 MB.'
      );
      // this.inputfile.nativeElement.value = ' ';
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
        // this.inputfile.nativeElement.value = ' ';
        return false;
      }
    }

    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        rfqId: this.rfqId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        remarks: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };

      this.loaderService.setShowLoading();
      this.sowjdDetailsService
        .uploadProposalDocuments(input)
        .subscribe((response: any) => {
          if (response.status === 'success') {
            this.notifyservice.alert('Document Added Successfully');
            this.loaderService.setDisableLoading();
            this.getProposalDocuments();
          }
        });
    });
  }

  getProposalDocuments() {
    this.sowjdDetailsService
      .getProposalDocuments(this.rfqId)
      .subscribe((response: any) => {
        this.proposalDocuments = response;
      });
  }

  notInterested(isInterested: boolean) {
    let dialogRef = this.dialog.open(RfqRemarksComponent, {
      width: '30vw',
      data: 'Not Interested',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.remarks) {
        this.loaderService.setShowLoading();
        let input = {
          isInterested: isInterested,
          rfqId: this.rfqId,
          remarks: result.remarks,
        };

        this.sowjdDetailsService.sowstatatusNotInterested(input).subscribe({
          next: (response: any) => {
            if (response.data[0].isSuccess) {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('Not Interested on this RFQ');
              this.ngOnInit();
            }
          },
          error: (error: any) => {
            this.loaderService.setDisableLoading();
          },
        });
      }
    });
  }

  getRFQDetail() {
    this.loaderService.setShowLoading();
    if (this.rfqId) {
      this.vendorService
        .getRFQDetailByRfqId(this.rfqId)
        .subscribe((rfqDetail: any) => {
          if (rfqDetail) {
            this.loaderService.setDisableLoading();
            this.rfqDetail = rfqDetail.data.getRFQPODetails[0];

            this.companyCurrencyName = this.rfqDetail?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (
              this.rfqDetail.rfqStatusID === 1 ||
              this.rfqDetail.rfqStatusID === 5
            ) {
              if (
                new Date(this.rfqDetail.rfqEndDate).setHours(0, 0, 0, 0) <
                new Date().setHours(0, 0, 0, 0)
              ) {
                this.isRFQRecordeLocked = true;
                this.checkRFQDateMessage =
                  'RFQ End date is over, record is locked';
              } else {
                this.isRFQRecordeLocked = false;
              }
            }

            if (
              !(
                this.rfqDetail.rfqStatusID === 1 ||
                this.rfqDetail.rfqStatusID === 5
              )
            ) {
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
                  field: 'pmo',
                  cellRenderer: (params: any) =>
                    this.numericFormatPipe.transform(
                      params.data.pmo,
                      this.companyLocale,
                      this.companyNumericFormat
                    ),
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
              ];
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
                  field: 'pmo',
                  cellRenderer: (params: any) =>
                    this.numericFormatPipe.transform(
                      params.data.pmo,
                      this.companyLocale,
                      this.companyNumericFormat
                    ),
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
              ];

              this.columnDefsSkillsetsTAM = [
                {
                  headerName: 'SkillSet',
                  field: 'skillsetName',
                },
                {
                  headerName: 'Grade',
                  field: 'gradeName',
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
                  field: 'estimationActivity',
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
              ];
            }
            this.vendorDetail = rfqDetail.data.vendorDetails[0];

            if (this.rfqDetail.sowJdId) {
              this.getSowjdDocuments();
              this.getVendorSkillSet();
            }
            this.getProposalDocuments();
            this.getResurces();
            this.getWorkPackage();
          }
        });
    }
  }
  getVendorSkillSet() {
    this.loaderService.setShowLoading();
    this.sowjdService.getVendorSkillSet(this.rfqDetail.sowJdId).subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.rowDataVendorSkillset = res.data;
        this.gridApiVendor.setRowData(this.rowDataVendorSkillset);
        this.adjustWidthSkill();
      },
      error: (e) => {
        console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }
  getSowjdDocuments() {
    this.sowjdService
      .getAllVendorDocumentsBySowJdId(this.rfqDetail.sowJdId)
      .subscribe((docList: any) => {
        this.documentsList = docList;
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
        this.sowjdDetailsService
          .deleteProposalDocuments(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('Document deleted Successful');
              this.getProposalDocuments();
            }
          });
      }
    });
  }

  getResurces() {
    this.sowjdDetailsService
      .getResource(this.rfqId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.resourceList = response.data.resourceResponses;
          this.resourceSummary = response.data.equivalentResponses;

          this.gridApi?.setRowData(this.resourceList);
          this.adjustAll();
        }
      });
  }

  getWorkPackage() {
    this.sowjdDetailsService
      .getWorkPackage(this.rfqId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.workPackageList = response.data.workPackages;
          this.workPackageSummary = response.data.getworkPackages;

          this.gridApiWP?.setRowData(this.workPackageList);
          this.adjustAll();
        }
      });
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApiVendor = params.api;
    this.gridApiVendor.setDomLayout('autoHeight');

    this.columnApiSkillset = params.columnApi;

    this.gridApiVendor.refreshCells({ force: true });
    this.gridApiVendor.hideOverlay();
    if (
      this.rowDataVendorSkillset == null ||
      this.rowDataVendorSkillset == undefined ||
      this.rowDataVendorSkillset.length <= 0
    )
      this.gridApiVendor.showNoRowsOverlay();
    this.gridApiVendor.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiVendor.hideOverlay();

    this.adjustWidthSkill();
  }

  adjustWidthSkill() {
    const allColumnIds: any = [];
    this.columnApiSkillset?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiSkillset?.autoSizeColumns(allColumnIds, false);
  }

  vendorResourceGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    this.columnApiVSPTwo = params.columnApi;

    this.gridApi.refreshCells({ force: true });

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

  workPackageGridReady(params: GridReadyEvent) {
    this.gridApiWP = params.api;
    this.gridApiWP.setDomLayout('autoHeight');

    this.columnApiWPTwo = params.columnApi;

    this.gridApiWP.refreshCells({ force: true });
    this.gridApiWP.hideOverlay();
    if (
      this.workPackageList == null ||
      this.workPackageList == undefined ||
      this.workPackageList.length <= 0
    )
      this.gridApiWP.showNoRowsOverlay();
    this.gridApiWP.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiWP.hideOverlay();
    this.adjustAll();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  //Auto-Width Fix -start
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
  //Auto-Width Fix -End

  adjustAll() {
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
