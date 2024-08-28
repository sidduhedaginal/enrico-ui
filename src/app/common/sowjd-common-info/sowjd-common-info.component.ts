import { Component, Input, Pipe, ViewChild } from '@angular/core';
import { config } from 'src/app/config';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DateFormatComponent } from '../date-format/date-format.component';
import { AgGridAngular } from 'ag-grid-angular';
import { CurrencyPipe } from '../currency-pipe/currency.pipe';
import { NumericFormatPipe } from '../numeric-format-pipe/numeric-format-pipe';

@Component({
  selector: 'app-sowjd-common-info',
  templateUrl: 'sowjd-common-info.component.html',
  styleUrls: ['./sowjd-common-info.component.scss'],
})
export class SowjdCommonInfoComponent {
  dateFormat = config.dateFormat;
  sowjddetaildata: any;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  groupData: any;
  sowjdDocumentdata: any;
  rowData_DeptData = [];
  @Input() sowJdId: string;
  private gridApi!: GridApi;
  private gridApiSkillset!: GridApi;
  columnApi: any;
  public rowData = [];

  // public rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private loaderService: LoaderService,
    private sowjdService: sowjdService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {}

  public columnDefsSkillsets = [
    {
      headerName: 'SkillSet',
      field: 'skillsetName',
    },
    {
      headerName: 'Classification',
      field: 'classification',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
    },
    {
      headerName: 'No of Resource',
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
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Personal Cost',
      field: 'personalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.personalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'OH Cost',
      field: 'ohCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.ohCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
      field: 'totalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
      resizable: false,
    },
  ];

  public columnDefs_UserDeptDetails = [
    {
      headerName: 'Role',
      hide: false,
      field: 'role',
    },
    {
      headerName: 'Name',
      hide: false,
      field: 'name',
    },
    {
      headerName: 'Email',
      hide: false,
      field: 'email',
      resizable: false,
    },
  ];

  autoGroupColumnDef: ColDef = { minWidth: 210 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 195,
    enableValue: false,
    wrapText: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };

  ngOnInit() {
    this.getAllSowjdDetails();
  }

  getAllSowjdDetails() {
    this.loaderService.setShowLoading();
    if (this.sowJdId) {
      this.sowjdService
        .getAllSowjdDetails(this.sowJdId)
        .subscribe((res: any) => {
          this.sowjddetaildata = res[0].data.sowJdEntityResponse;
          this.companyCurrencyName = this.sowjddetaildata?.currencyName;

          let currencyObj = this.loaderService.getCountryDetailByCurrency(
            this.companyCurrencyName
          );

          this.companyLocale = currencyObj.locale;
          this.companyNumericFormat = currencyObj.numericFormat;

          this.groupData = {
            groupCode: this.sowjddetaildata?.group,
          };
          if (this.groupData.groupCode) {
            this.getDepartmentUserDetails(this.groupData);
          }

          this.sowjdDocumentdata = res[1];

          this.loaderService.setDisableLoading();
          // this.adjustWidth();
        });

      this.sowjdService.getSkillSet(this.sowJdId).subscribe({
        next: (res: any) => {
          this.rowData = res.data;
          this.adjustWidth();
        },
        error: (e) => {
          console.error(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
    }
  }

  //Auto-Width Fix -start
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  }

  onFilterChanged(event: any) {
    this.adjustWidth();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }

  getDepartmentUserDetails(groupData: any) {
    this.sowjdService.getDepartmentUserDetails(groupData).subscribe({
      next: (res: any) => {
        this.rowData_DeptData = res.data.usersInGroups;
        // this.adjustWidth();
      },
      error: (e) => {
        console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }

  onGridReadyDept(params: GridReadyEvent) {
    this.gridApi = params.api;
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.rowData_DeptData == null ||
      this.rowData_DeptData == undefined ||
      this.rowData_DeptData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    // this.adjustWidth();
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApiSkillset = params.api;

    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.columnApi = params.columnApi;
    this.gridApiSkillset.refreshCells({ force: true });
    this.gridApiSkillset.setDomLayout('autoHeight');
    this.gridApiSkillset.hideOverlay();
    if (
      this.rowData == null ||
      this.rowData == undefined ||
      this.rowData.length <= 0
    )
      this.gridApiSkillset.showNoRowsOverlay();
    this.gridApiSkillset.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiSkillset.hideOverlay();
    params.api.setRowData(this.rowData);
    // this.adjustWidth();
    //Auto-Width Fix -end
  }
}
