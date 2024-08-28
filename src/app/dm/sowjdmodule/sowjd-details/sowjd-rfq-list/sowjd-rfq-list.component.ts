import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { SowjdRfqDetailsHyperlinkComponent } from '../../sowjd-rfq-details-hyperlink/sowjd-rfq-details-hyperlink.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sowjd-rfq-list',
  templateUrl: './sowjd-rfq-list.component.html',
  styleUrls: ['./sowjd-rfq-list.component.scss'],
})
export class SowjdRfqListComponent {
  sowjd: string;
  RFQList: any;
  private gridApi!: GridApi;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.adjustWidth();
  }
  constructor(
    private route: ActivatedRoute,
    private sowjdService: sowjdService,
    private loaderService: LoaderService
  ) {}
  autoGroupColumnDef: ColDef = { minWidth: 200 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 2,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any; //Auto-Width Fix
  // public defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: 'agSetColumnFilter',
  //   resizable: true,
  //   flex: 1,
  //   minWidth: 200,
  //   enableValue: false,
  //   enableRowGroup: false,
  //   enablePivot: false,
  //   menuTabs: ['filterMenuTab'],
  //   wrapText: true, // <-- HERE
  //   autoHeight: true, // <-- & HERE
  //   cellStyle: { 'text-align': 'left' },
  // };
  public columnDefs = [
    {
      headerName: 'RFQ-ID',
      hide: false,
      field: 'rfqNumber',
      cellRenderer: SowjdRfqDetailsHyperlinkComponent,
    },
    {
      headerName: 'Vendor',
      hide: false,
      field: 'vendorName',
    },
    {
      headerName: 'Vendor Email',
      hide: false,
      field: 'vendorEmail',
    },
    {
      headerName: 'Status',
      hide: false,
      field: 'sowJdRfqStatus',
    },
    {
      headerName: 'Technical Score',
      hide: false,
      field: 'score',
    },
    {
      headerName: 'RFQ-Technical Evaluation Owner',
      hide: false,
      field: 'rfqTechnicalEvaluationOwner',
      resizable: false,
    },
  ];

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.sowjd = params['id'];
      if (this.sowjd) {
        this.loaderService.setShowLoading();
        this.sowjdService.getTechRating(this.sowjd).subscribe((res: any) => {
          this.RFQList = res.data.sowjdRfqDetails;
          this.loaderService.setDisableLoading();
          this.adjustWidth();
        });
      }
    });
  }

  MysowjdRFQList(params: GridReadyEvent) {
    this.gridApi = params.api;
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.RFQList == null ||
      this.RFQList == undefined ||
      this.RFQList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
    //Auto-Width Fix -end
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
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustWidth();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }
  //Auto-Width Fix -End
}
