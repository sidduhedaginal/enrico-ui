import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-enterprise';

@Component({
  selector: 'lib-masterdetails',
  templateUrl: './masterdetails.component.html',
  styleUrls: ['./masterdetails.component.scss'],
})
export class MasterdetailsComponent implements OnInit {
  public routerdata: any = [];
  public title!: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject('MASTER_API_URL') private url: string
  ) {}

  public style: any = {
    width: '100%',
    height: '100%',
    flex: '1',
    'margin-top': '5px',
    display: 'flex',
  };

  private gridApi!: GridApi;
  public gridColumns: any = [];

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(
      (params: any) =>
        (this.routerdata.title = JSON.parse(params.params.routertitle))
    );
    var windowsHeight = window.innerHeight;
    this.style = {
      width: '100%',
      height: windowsHeight - 140 + 'px',
      'min-height': windowsHeight - 140 + 'px',
      flex: '1  ',
      'margin-top': '3px',
    };

    this.gridApi.closeToolPanel();
  }

  public columnDefs: any = [];
  public userConfigColumns: any;
  public selectedColumns: any;

  columnDefs1 = [
    { field: 'fileName', headerName: 'File Name' },
    { field: 'createdBy', headerName: 'Created By' },
    { field: 'modifiedBy', headerName: 'Modified By' },
    {
      field: '',
      headerName: 'Download',
      cellRenderer: this.sowLink,
      filter: false,
    },
  ];
  public defaultColDef: ColDef = {
    sortable: true,
    //filter: 'agTextColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 100,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
    wrapText: true, // <-- HERE
    autoHeight: true, // <-- & HERE
  };

  public rowData = [
    {
      fileName: 'Company Master.xlsx',
      menuId: 2,
      url: 'https://sowjddocuments.blob.core.windows.net/md-documents/Company Master_1689945902605.xlsx',
      createdBy: 'AAA3COB',
      createdOn: '2023-07-21T13:25:12.9230036+00:00',
      modifiedBy: null,
      modifiedOn: null,
      id: 'e51885b3-61b1-42d5-be3f-09169bfd8a9a',
    },
    {
      fileName: 'Company Master.xlsx',
      menuId: 2,
      url: 'https://sowjddocuments.blob.core.windows.net/md-documents/Company Master_1689945902605.xlsx',
      createdBy: 'AAA3COB',
      createdOn: '2023-07-21T13:25:12.9230036+00:00',
      modifiedBy: null,
      modifiedOn: null,
      id: 'e51885b3-61b1-42d5-be3f-09169bfd8a9a',
    },
  ];

  aggrid() {
    this.router.navigate(['/grid'], {
      queryParams: { routertitle: JSON.stringify(this.routerdata) },
    });
  }

  sowLink(params: any) {
    let eGui = document.createElement('a');
    eGui.href = params.data.url;
    eGui.innerHTML = 'Download';
    return eGui;
  }

  onGridReady1(params: GridReadyEvent) {
    if (this.routerdata.title == undefined) {
      this.routerdata.title = 'Skillset Master';
    }

    if (
      this.routerdata.title === undefined ||
      this.routerdata.title == '' ||
      this.routerdata.title == null
    ) {
      this.routerdata.title == 'Skillset Master';
    }

    // }api/master-data/get-history/35

    const dummyId = 35;
    fetch(`${this.url}/api/master-data/get-history/${dummyId}`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.result.tableOutput != null) {
          var masterTableData = JSON.parse(data.result.tableOutput);
          this.rowData = masterTableData;
          this.gridApi.setRowData(masterTableData);
        }
      });
  }

  dynamicallyConfigureColumnsFromObject_byShri(anObject: any) {
    if (anObject != null) {
      this.columnDefs = this.gridApi.getColumnDefs();
      this.columnDefs.length = 0;
      const keys = Object.keys(anObject);
      if (this.userConfigColumns != null) {
        for (var datas = 0; datas < keys.length; datas++) {
          if (keys[datas] != 'ApprovedBy' && keys[datas] != 'ApprovedDate') {
            if (this.userConfigColumns.indexOf(keys[datas]) >= 0) {
              this.columnDefs.push({ field: keys[datas], hide: false });
              this.selectedColumns.push(keys[datas]);
            } else {
              this.columnDefs.push({ field: keys[datas], hide: false });
            }
          }
        }
      } else {
        keys.forEach((key) =>
          this.columnDefs.push({ field: key, hide: false })
        );
        this.selectedColumns = this.columnDefs;
      }

      this.columnDefs.push({
        field: 'Actions',
        editable: false,
        colId: 'action',
        cellRenderer: function () {
          return '<button style="background:none;border:none;outline: none;"> <mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#cf2a27">download</mat-icon></button>';
        },
      });

      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs = this.columnDefs;
    } else {
      this.columnDefs.length = 0;
      for (var datas = 0; datas < this.gridColumns.length; datas++) {
        this.columnDefs.push({ field: this.gridColumns[datas] });
      }
      this.gridApi.setColumnDefs(this.columnDefs);
      this.columnDefs1 = this.columnDefs;
    }
  }
}
