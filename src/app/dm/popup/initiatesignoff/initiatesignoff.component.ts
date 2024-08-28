import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { InputComponent } from 'src/app/vendor/vendor-srn/create-srn/input/input.component';

@Component({
  selector: 'app-initiatesignoff',
  templateUrl: './initiatesignoff.component.html',
  styleUrls: ['./initiatesignoff.component.scss'],
})
export class InitiatesignoffComponent {
  sowJdId: any;
  rfqId: any;
  initiateSignOff: FormGroup;
  errorMessage: string;
  sowjdList: any = [];
  venderList: any = [];
  endDate: Date;
  private gridApi!: GridApi;
  columnApiSkillset: any;
  rowDataSkillset = [];
  isValidVendorShare: boolean = true;
  isTimeAndMaterial: boolean = false;
  isOpenDemandZero: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<InitiatesignoffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {
    this.sowJdId = this.data.sowJdId;
    this.rfqId = this.data.rfqId;
  }

  onInputNumber(event: any) {
    const inputValue: string = event.target.value;
    const integerRegex: RegExp = /^[0-9]*$/;
    if (!integerRegex.test(inputValue)) {
      const sanitizedInput: string = inputValue.replace(/[^0-9]/g, '');
      event.target.value = sanitizedInput;
    }
  }

  openDemandGetter(params: any) {
    const openDemand = (params.data.openDemand =
      params.data.totalQuantity -
      (params.data.allocatedShare + +params.data.vendorShare));
    // this.checkOpenDemand();
    return openDemand;
  }

  checkOpenDemand() {
    let isOpenDemandAllZero = this.rowDataSkillset.every(
      (item) => item.openDemand === 0
    );
    if (isOpenDemandAllZero) {
      this.isOpenDemandZero = true;
      this.errorMessage = 'All Open Demands are fulfilled.';
    }
  }
  onCellValueChangedVendorShare(params: any) {
    const { newValue } = params;
    if (newValue <= params.data.totalQuantity - params.data.allocatedShare) {
      params.data.vendorShare = +newValue;
      this.isValidVendorShare = true;
      this.openDemandGetter(params);
    } else {
      this.isValidVendorShare = false;
      this.notifyservice.alert(
        `Vendor share should not be more than available demand ${
          params.data.totalQuantity - params.data.allocatedShare
        }`
      );
      params.data.vendorShare = null;
      this.gridApi.setRowData(this.rowDataSkillset);
      return;
    }
  }
  public columnDefsSkillsets = [
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
      field: 'totalQuantity',
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
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
    },
    {
      headerName: 'Vendor Share',
      field: 'vendorShare',
      editable: true,
      cellRenderer: InputComponent,
      onCellValueChanged: this.onCellValueChangedVendorShare.bind(this),
    },
    {
      headerName: 'Open Demand',
      field: 'openDemand',
      resizable: false,
      valueGetter: this.openDemandGetter.bind(this),
    },
  ];

  autoGroupColumnDef: ColDef = { minWidth: 180 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 0,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    wrapText: true,
    autoHeight: true,
    cellStyle: { 'text-align': 'left' },
    menuTabs: ['filterMenuTab'],
  };

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.sowjdService
      .getSowJdDetailsByRfqId(this.rfqId)
      .subscribe((response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.sowjdList = response.data.getRFQPODetailsByRfqId[0];
          this.venderList = response.data.vendorDetailsByRfqId[0];
          this.getSkillSet();
          if (this.sowjdList?.outSourcingCode === 'TAM') {
            this.isTimeAndMaterial = true;
          }
        }
      });

    this.endDate = this.sowjdService.addNumberOfdays(new Date(), 5);

    this.initiateSignOff = this.fb.group({
      tpEndDate: [this.endDate, Validators.required],
      remarks: ['', Validators.required],
    });
  }

  getSkillSet() {
    this.loaderService.setShowLoading();
    this.sowjdService
      .getSkillSetForInitiateSignOff(this.sowjdList.sowJdId)
      .subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          this.rowDataSkillset = res.data.soWJdIdentifiedSkillset;
          this.gridApi.setRowData(this.rowDataSkillset);
          this.adjustWidthSkill();
        },
        error: (e) => {
          console.error(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    this.columnApiSkillset = params.columnApi;

    this.gridApi.refreshCells({ force: true });
    this.gridApi.hideOverlay();
    if (
      this.rowDataSkillset == null ||
      this.rowDataSkillset == undefined ||
      this.rowDataSkillset.length <= 0
    )
      this.gridApi.showNoRowsOverlay();

    this.gridApi.hideOverlay();

    this.adjustWidthSkill();
  }

  adjustWidthSkill() {
    const allColumnIds: any = [];
    this.columnApiSkillset?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiSkillset?.autoSizeColumns(allColumnIds, false);
  }

  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  };

  cancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.initiateSignOff.markAllAsTouched();
    if (this.initiateSignOff.invalid) return;

    if (this.sowjdList?.outSourcingCode === 'TAM') {
      let isVendorShareAllZero = this.rowDataSkillset.every(
        (item) => item.vendorShare === 0 || item.vendorShare === null
      );
      if (isVendorShareAllZero) {
        this.errorMessage = 'All Vendor shares cannot be zero or empty';
        return;
      }
    }

    let soWJdSkillset = this.rowDataSkillset.map((element) => {
      return {
        sowJdId: element.sowJdId,
        soWJdSkillsetId: element.soWJdSkillsetId,
        skillsetId: element.skillsetId,
        gradeId: element.gradeId,
        totalQuantity: element.totalQuantity,
        vendorShare: element.vendorShare != null ? element.vendorShare : 0,
      };
    });

    let initiateSignOffObj = {
      rfqId: this.rfqId,
      endDate: this.initiateSignOff.value.tpEndDate,
      comments: this.initiateSignOff.value.remarks,
      isTimeAndMaterial: this.isTimeAndMaterial,
      soWJdIdentifiedSkillset: soWJdSkillset,
    };
    this.loaderService.setShowLoading();

    this.sowjdService.postInitiateSignOffObjForm(initiateSignOffObj).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.dialogRef.close();
          this.notifyservice.alert('RFQ Initiate Sign Off Successful.');
          this.router.navigate(['sowjd/sowjd-signoff']);
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidthSkill();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustWidthSkill();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustWidthSkill();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidthSkill();
    }, 500);
  }
  onSortChanged(event: any) {
    this.adjustWidthSkill();
  }
}
