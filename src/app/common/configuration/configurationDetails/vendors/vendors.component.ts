import { Component, OnInit } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, IDetailCellRendererParams } from 'ag-grid-community';
import { CommonApiServiceService } from '../../../common-api-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '../../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit  {
  
  ngOnInit(): void {}
  private gridApi!: GridApi;
  constructor(
    private commonApiService: CommonApiServiceService,
    private dialog: MatDialog,
    public loaderService : LoaderService ,
    private snackBar: MatSnackBar,
  ) {}

  gridOptions : GridOptions = {
    domLayout: 'autoHeight',
    // suppressHorizontalScroll: false,
    // suppressVerticalScroll: false
    
  };

  public detailRowHeight= 400;
  public groupDefaultExpanded = 10;
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };

  // constantRow = [
  //   {
  //       "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //       "moduleName": "Vendor",
  //       "moduleDescription": "Vendor module",
  //       "moduleIcon": " ",
  //       "urlPath": "vendor",
  //       children : [
  //           {
  //               "id": "7c57833d-a9db-4d18-befe-0f0d72da9486",
  //               "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //               "featureName": "MySubmissions",
  //               "featureDescription": "My Submissions",
  //               "urlPath": null,
  //               "featureCode": "MySubmissions",
  //               "featureNumber": null,
  //               "isDeleted": false
  //           },
  //           {
  //               "id": "dd433656-d149-4d35-b4ac-0f3c9fa7858d",
  //               "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //               "featureName": "Resources",
  //               "featureDescription": "Resources",
  //               "urlPath": null,
  //               "featureCode": "Resources",
  //               "featureNumber": null,
  //               "isDeleted": false
  //           },
  //           {
  //               "id": "76e41346-ad40-4752-ab0c-2255a46fa7e1",
  //               "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //               "featureName": "VendorRoateCards",
  //               "featureDescription": "Vendor Roate Cards",
  //               "urlPath": null,
  //               "featureCode": "VendorRoateCards",
  //               "featureNumber": null,
  //               "isDeleted": false
  //           },
  //           {
  //               "id": "59828dbf-9f65-41b4-ba78-a9aa3aaf0944",
  //               "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //               "featureName": "SOWJDS",
  //               "featureDescription": "Open SOW JDs",
  //               "urlPath": null,
  //               "featureCode": "SOWJDS",
  //               "featureNumber": null,
  //               "isDeleted": false
  //           },
  //           {
  //               "id": "4f69e760-591a-4b6e-bc12-d1bdac80f8a5",
  //               "moduleId": "b73e612c-0f91-4c8a-8291-143248f1b27d",
  //               "featureName": "MyDetails",
  //               "featureDescription": "My Details",
  //               "urlPath": null,
  //               "featureCode": "MyDetails",
  //               "featureNumber": null,
  //               "isDeleted": false
  //           }
  //       ]
  //   }
  // ]
  rowData :any = [];
  columnDefs: ColDef[] = [
    { headerName: 'Module Name', field: 'moduleName' },
    { headerName: 'Module Description', field: 'moduleDescription' },
    {
      headerName: 'Module Icon',
      field: 'moduleIcon',
      hide: true,
    },
    {
      headerName: 'Url Path',
      field: 'urlPath',
      hide: true,
    },
  ];

  detailCellRendererParams:any={
  
    // level 3 grid options
    detailGridOptions: {
      columnDefs: [
        { 
          headerName: 'Feature Name',
          field: 'featureName', 
          resizable: true,
          
        },
        { 
          headerName: 'Feature Description',
          field:'featureDescription',
          resizable: true,
          
        },
        {
          headerName: 'Feature Code',
          field : 'featureCode',
          resizable : true

        },

        { 
          headerName: 'Url Path',
          field: "urlPath",
          resizable: true,
          hide:true
        },
     
      ],  
      defaultColDef: {
        flex: 1,
        minWidth: 170,
      },
      detailRowHeight: 155,
    },

    getDetailRowData: (params:any) => {
      params.successCallback(params.data.feature);
    },
  } as IDetailCellRendererParams;

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getVendors();
  }

  getVendors() {

    this.loaderService.setShowLoading();
    this.commonApiService.getVendors().subscribe({
      next: (response: any) => {
        this.rowData = response.data;
        this.gridApi.setRowData(this.rowData);

      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
        this.showSnackbar(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

}
