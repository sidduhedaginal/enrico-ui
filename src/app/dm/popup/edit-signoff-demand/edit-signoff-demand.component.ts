import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { InputComponent } from 'src/app/vendor/vendor-srn/create-srn/input/input.component';

@Component({
  selector: 'app-edit-signoff-demand',
  templateUrl: './edit-signoff-demand.component.html',
  styleUrls: ['./edit-signoff-demand.component.scss'],
})
export class EditSignoffDemandComponent {
  tpId: string;
  initiateSignOff: FormGroup;
  endDate: Date;
  private gridApi!: GridApi;
  rowDataSkillset = [];
  isValidVendorShare: boolean = true;
  signOffDetail: any;
  vendorDetail: any;
  isOpenDemandZero: boolean = false;
  errorMessage: string;
  columnApiSkillset: any;

  constructor(
    private dialogRef: MatDialogRef<EditSignoffDemandComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {
    this.signOffDetail = this.data.signOffDetail;
    this.vendorDetail = this.data.vendorDetail;
    this.rowDataSkillset = this.data.rowDataSkillset;
    this.tpId = this.data.tpId;

    let isOpenDemandAllZero = this.rowDataSkillset.every(
      (item) => item.openDemand === 0
    );

    if (isOpenDemandAllZero) {
      this.isOpenDemandZero = true;
      this.errorMessage = 'All Open Demands are fulfilled.';
    }
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
    return (params.data.openDemand =
      params.data.totalQuantity -
      (params.data.totalAllocatedShare + +params.data.vendorShare));
  }

  onCellValueChangedVendorShare(params: any) {
    const { newValue } = params;
    if (
      newValue <=
      params.data.totalQuantity - params.data.totalAllocatedShare
    ) {
      params.data.vendorShare = +newValue;
      this.isValidVendorShare = true;
      this.openDemandGetter(params);
    } else {
      this.isValidVendorShare = false;
      this.notifyservice.alert(
        `Vendor share should not be more than available demand ${
          params.data.totalQuantity - params.data.totalAllocatedShare
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
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
    },
    {
      headerName: 'Vendor Share',
      field: 'vendorShare',
      minWidth: 150,
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
    this.endDate = this.sowjdService.addNumberOfdays(new Date(), 5);

    this.initiateSignOff = this.fb.group({
      tpEndDate: [this.endDate, Validators.required],
      remarks: ['', Validators.required],
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

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.initiateSignOff.markAllAsTouched();
    if (this.initiateSignOff.invalid) return;

    if (this.signOffDetail?.outSourcingCode === 'TAM') {
      let isVendorShareAllZero = this.rowDataSkillset.every(
        (item) => item.vendorShare === 0
      );
      if (isVendorShareAllZero) {
        this.errorMessage = 'All Vendor shares cannot be zero';
        return;
      }
    }

    let soWJdSkillset = this.rowDataSkillset.map((element) => {
      return {
        id: element.id,
        vendorShare: element.vendorShare + element.quantity,
      };
    });

    let updateSignOffDemandObj = {
      tpId: this.tpId,
      endDate: this.initiateSignOff.value.tpEndDate,
      comments: this.initiateSignOff.value.remarks,
      soWJdIdentifiedSkillset: soWJdSkillset,
    };
    this.loaderService.setShowLoading();

    console.log(this.rowDataSkillset);
    console.log(updateSignOffDemandObj);
    this.sowjdService
      .updateInitiateSignOffObjForm(updateSignOffDemandObj)
      .subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert('Sign off demand updated successful.');
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
