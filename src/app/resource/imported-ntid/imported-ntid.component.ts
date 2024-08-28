import { HttpClient } from '@angular/common/http';
import {Component,HostListener,Inject,OnInit,ViewChild,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, GridReadyEvent } from 'ag-grid-community';
import { ColDef, GridApi } from 'ag-grid-enterprise';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import 'ag-grid-enterprise';
// import {menuId, dateFieldsForImports, hiddenColumns} from '../constants/app-constant';
import { DatePipe } from '@angular/common';
import { ImportsummaryComponent } from 'src/app/master/importsummary/importsummary.component';
import { ImportErrorComponent } from 'src/app/master/popup/import-error/import-error.component';
import { dateFieldsForImports, hiddenColumns } from 'src/app/master/constants/app-constant';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { ImportedNTIDService } from '../imported-ntid.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-imported-ntid',
  templateUrl: './imported-ntid.component.html',
  styleUrls: ['./imported-ntid.component.css'],
  providers:[DatePipe]
})
export class ImportedNTIDComponent {
  private gridApi!: GridApi;
  public columnApi: any;
  public importedxls: any = [];
  public columnDefs: any = [];
  public colDefs: any = [];
  public rowData: any = [];
  public seletedFile: any;
  public showloader = false;
  public defaultColumns: any = [];
  public tranformedRowsFromApi: any = [];
  public isImported:boolean=false;
   importdata: any;
  ImportSummaryDate :any;
  public transformedExcelData: any = [];
  public showFilterDropDown = false;
  public selectedOption = '';
  flagId: { [key: string]: number } = {
    ['Error']: 0,
    ['Insert']: 1,
    ['Update']: 2,
    ['Inserted']: 3,
    ['Updated']: 4,
    ['ShowAll']: 5,
  };
  minWidthColumn :any = ["srNo", "type"];
  public gridOptions = {
    columnDefs: this.columnDefs,
    enableSorting: true,
    enableFilter: true,
  };
  routerdata: any;
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  overlayNoRowsTemplate = '<span></span>';
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
  SecondLevelId : any;
  companyCode:any;
  tabid:any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private importdataService: ImportedNTIDService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apiService: PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private datePipe: DatePipe, 
      @Inject('MASTER_API_URL') private url: string
  ) {
    let todayDate = new Date();
    this.ImportSummaryDate = this.datePipe.transform(todayDate , 'dd-MMM-yyyy'); 
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.router.navigate(['planning/second-level-details'],{queryParams:{id:this.SecondLevelId}})
  }

  ngOnInit(): void {
    this.showFilterDropDown = false;
    const routerState = history.state;
    if (routerState) {
      this.routerdata = JSON.parse(routerState.routerdata);
      this.importedxls = JSON.parse(routerState.responsedata);
      this.tabid = routerState.metadataid;
    }
    // this.getSecondLevelDetail()
    this.defaultColumns = this.importedxls.defaultColumns;
    this.defaultColumns = this.defaultColumns.map((str: string) => {
      const firstLetterLowercase = str.charAt(0).toLowerCase();
      const remainingLetters = str.slice(1);
      return firstLetterLowercase + remainingLetters;
    });
    this.importedxls = this.importedxls.object;
    for (const obj of this.importedxls) {
      if (obj.message === null) {
        obj.message = 'none';
      }
    }
    this.seletedFile = this.importdataService.getSeletedFile();
  }
  aggrid() {
    this.router.navigate(['Resource-Management'],{queryParams:{id:this.SecondLevelId}})
  }

  onCellClicked(e: CellClickedEvent): void {}

  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  onGridReady(params: GridReadyEvent) {
    for(let item of this.importedxls){
      // item.validityEnd = this.datePipe.transform(item.validityEnd, 'dd-MMM-yyyy');
      // item.validityStart = this.datePipe.transform(item.validityStart, 'dd-MMM-yyyy');

      // item.validFrom = this.datePipe.transform(item.validFrom, 'dd-MMM-yyyy');
      // item.validTo = this.datePipe.transform(item.validTo, 'dd-MMM-yyyy');

      // item.periodStart = this.datePipe.transform(item.periodStart, 'dd-MMM-yyyy');
      // item.periodEnd = this.datePipe.transform(item.periodEnd, 'dd-MMM-yyyy');


      // item.documentData = this.datePipe.transform(item.documentData, 'dd-MMM-yyyy');
      // item.startDate = this.datePipe.transform(item.startDate, 'dd-MMM-yyyy');

      // item.approvedDate = this.datePipe.transform(item.approvedDate, 'dd-MMM-yyyy');
      // item.technicallyCompleted = this.datePipe.transform(item.technicallyCompleted, 'dd-MMM-yyyy');

      // item.deliveryDate = this.datePipe.transform(item.deliveryDate, 'dd-MMM-yyyy');
      // item.vendorInvoiceDate = this.datePipe.transform(item.vendorInvoiceDate, 'dd-MMM-yyyy');


      // item.postingDate = this.datePipe.transform(item.deliveryDate, 'dd-MMM-yyyy');
       
      // item.dateofLeaving = this.datePipe.transform(item.dateofLeaving, 'dd-MMM-yyyy');


      // item.CFCyclePlanningStartDate = this.datePipe.transform(item.CFCyclePlanningStartDate, 'dd-MMM-yyyy');
      // item.CFCyclePlanningEndate = this.datePipe.transform(item.CFCyclePlanningEndate, 'dd-MMM-yyyy');

      // item.SAPCreatedOn = this.datePipe.transform(item.SAPCreatedOn, 'dd-MMM-yyyy');

      // item.changedOn = this.datePipe.transform(item.changedOn, 'dd-MMM-yyyy');

      // item.enteredOn = this.datePipe.transform(item.enteredOn, 'dd-MMM-yyyy');
      // item.dateOfJoining = this.datePipe.transform(item.dateOfJoining, 'dd-MMM-yyyy');
      
      // item.contEnd = this.datePipe.transform(item.contEnd, 'dd-MMM-yyyy');
      // item.documentDate = this.datePipe.transform(item.documentDate, 'dd-MMM-yyyy');
      // item.sapCreatedOn = this.datePipe.transform(item.sapCreatedOn, 'dd-MMM-yyyy');
      // item.deletionIndicator = this.datePipe.transform(item.deletionIndicator, 'dd-MMM-yyyy');

    }
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.columnApi = params.columnApi;
    this.adjustWidth();
    this.gridApi.refreshCells({ force: true });
    this.gridApi.hideOverlay();
    if (
      this.rowData == null ||
      this.rowData == undefined ||
      this.rowData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );

    this.gridApi.setDomLayout('autoHeight');
    this.dynamicallyConfigureColumnsFromObject(this.importedxls[0]);
    this.gridApi.setRowData(this.importedxls);
    this.columnDefs = this.gridApi.getColumnDefs();

    for (const col of this.columnDefs) {
      if (this.defaultColumns.includes(col.field.toLowerCase() )) col.hide = false;
      else col.hide = true;
    }

    this.columnDefs.unshift({
      headerName: '',
      hide: false,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
      suppressMenu: true,
      //headerCheckboxSelectionCurrentPageOnly: true,
      headerCheckboxSelectionMultiSelect: true,
      maxWidth: 50,
    });

    this.gridApi.setColumnDefs(this.columnDefs);
    this.adjustWidth();
  }


  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  typeCheckTheRecord(flag: number, selectedRecords: any): boolean {
    if (selectedRecords.length == 0) {
      this.showSnackbar('No records Selected');
      return false;
    }
    const expectedType = flag == 1 ? 'Insert' : flag == 2 ? 'Update' : 'Error';
    if (flag == 3) {
      for (let index = 0; index < selectedRecords.length; index++) {
        if (
          selectedRecords[index].type != 'Insert' &&
          selectedRecords[index].type != 'Update'
        ) {
          this.openPopup();
          return false;
        }
      }
      return true;
    }
    for (let index = 0; index < selectedRecords.length; index++) {
      if (selectedRecords[index].type != expectedType) {
        this.openPopup();
        return false;
        // break;
      }
    }
    return true;
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(ImportErrorComponent, {
      width: '250px',
      data: {
        title: 'Error',
        message: 'Mismatch in the type!',
      },
    });
  }

  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApi?.autoSizeColumns(allColumnIds, false);
   }

  updateTheValuesOfRowData(rowData: any, flag: number, receivedObjects: any) {
    const mapOfReceivedObjects: Map<number, any> = new Map();
    receivedObjects.forEach((obj: any) => {
      mapOfReceivedObjects.set(obj.srNo, obj);
    });

    rowData.forEach((obj: any) => {
      const srNo = obj.srNo;
      if (mapOfReceivedObjects.has(srNo)) {
        Object.assign(obj, mapOfReceivedObjects.get(srNo));
      }else Object.assign(obj, obj);
    });
    return rowData;
  }
  getSecondLevelDetail(){
    this.apiService.GetSecondLevelDetails(this.SecondLevelId).subscribe({
      next: (res:any)=>{
        console.log(res.data.metadata.companyCode);
        this.companyCode = res.data.metadata.companyCode;
      }

    })}

  saveData(flag: number) {
    const selectedData = this.gridApi.getSelectedRows();
    let rowDataConst: any = [];
    this.gridApi.forEachNode((node) => {
      rowDataConst.push(node.data);
    });
    if (this.typeCheckTheRecord(flag, selectedData) == false) return;
    if (flag == 1) {
      this.selectedOption = 'Inserted';
    } else if (flag == 2) {
      this.selectedOption = 'Updated';
    } else if (flag == 3) {
      this.selectedOption = '';
    }
    this.loaderService.setShowLoading();
    this.showFilterDropDown = true;
    let rowDataModified = [];
    this.apiService
      .post(
        
        `api/resource/ResourceBoardingImportSave?tabId=${this.tabid}`,
        selectedData
      )
      .subscribe(
        (response: any) => {
          this.loaderService.setDisableLoading();
          this.importdata = response.data.data;
          //initial value
          const Summary = {
            TotalRecords: response.data.data.length,
            InsertedRecords: 0,
            updatedRecords: 0,
            errorRecords: 0,
          };
          response.data.data.forEach((item:any) => {
            const type = item.type.toLowerCase();
            if (type == 'inserted') {
              Summary.InsertedRecords++;
            } else if (type == 'updated') {
              Summary.updatedRecords++;
            } else if (type == 'error') {
              Summary.errorRecords++;
            }
          });
          rowDataModified = this.updateTheValuesOfRowData(
            rowDataConst,
            flag,
            response.data.data
          );

          const filterState = this.gridApi.getFilterModel();
          this.gridApi.setRowData(rowDataModified);
          this.gridApi.setFilterModel(filterState); 
          this.adjustWidth();
          rowDataConst = rowDataModified;
          this.rowData = rowDataModified;
          this.loaderService.setDisableLoading();
          this.isImported=true;
          this.OpenImportSummary(Summary);
          this.loaderService.setDisableLoading();
        },
        (error: any) => {
          this.loaderService.setDisableLoading();
        
        }
      );
    this.tranformedRowsFromApi = rowDataConst;
  }
  OpenImportSummary(Summary: any) {
    const dialogRef = this.dialog.open(ImportsummaryComponent, {
      width: '50%',
      data: { Summary: Summary },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        this.ExportImportedData(this.importdata);
      }
    });
  }
  ExportImportedData(params) {
    const excludedColumns = ['action'];
    const previousColumnDefs = this.columnDefs;
    const filteredDefs = previousColumnDefs?.filter((columnDef: any) => {
      return (
        !excludedColumns.includes(columnDef.colId) &&
        !excludedColumns.includes(columnDef.headerName) &&
        !hiddenColumns.includes(columnDef.field) &&
        columnDef.hasOwnProperty('field')
      );
    });
    params = {
      fileName: `${this.routerdata + '_ImportSummary' + '_' +  this.ImportSummaryDate}.xlsx`,
      sheetName:this.routerdata,
      
    };
    const previousData : any = [];
    this.gridApi.forEachNode((node :any) => {
      previousData.push(node.data);
    })
    const rowValues = previousData.map((obj:any) => ({ ...obj }));
    for (const obj of rowValues) {
      const hasCommonKeys = Object.keys(obj).some((key) =>
      dateFieldsForImports.includes(key)
      );
      if (hasCommonKeys) {
        for (const key in obj) {
          if (dateFieldsForImports.includes(key)) {
            obj[key] = this.updateDateFormat(obj[key]);
          }
        }
      }
    }
    const filterState = this.gridApi.getFilterModel();
    const fiterStateModified = JSON.parse(JSON.stringify(filterState));
    for(let key in fiterStateModified){
      if(dateFieldsForImports.includes(key)){
        for(let index = 0; index < fiterStateModified[key]["values"].length; index++){
          fiterStateModified[key]["values"][index] = this.updateDateFormat(fiterStateModified[key]["values"][index]);
        }
      }
    }
    this.gridApi.setColumnDefs(filteredDefs || []);
    this.gridApi.setRowData(rowValues);
    this.gridApi.setFilterModel(fiterStateModified);
    this.gridApi.exportDataAsExcel(params);
    // getting it back to previous state
    this.gridApi.setColumnDefs(previousColumnDefs || []);
    this.gridApi.setRowData(previousData);
    this.gridApi.setFilterModel(filterState);
    setTimeout(()=>{
      this.adjustWidth();
    },10);
  }

  dateRenderer(params: any) {   
    try {
      if (params?.value == null || params?.value.length < 10) return '';
      const date = params.value.substring(0, 10);
      const dateComponents = date.split('-');
      const rearrangedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
      return `<span class="price">${rearrangedDate}</span>`;
    } catch (error) {
      return '';
    }
  }

  dynamicallyConfigureColumnsFromObject(anObject: any) {
    this.colDefs = this.gridApi.getColumnDefs();
    this.colDefs.length = 0;
    const keys = Object.keys(anObject);
    keys.forEach((key) => {
      if (dateFieldsForImports.includes(key))
        this.colDefs.push({
          field: key,
          minWidth: 200,
          cellRenderer: this.dateRenderer,
        });
        else if(this.minWidthColumn.includes(key)){
          this.colDefs.push({ field: key, maxWidth: 120 });
        }
      else this.colDefs.push({ field: key, minWidth: 200 });
    });
    this.gridApi.setColumnDefs(this.colDefs);
    this.columnDefs = this.colDefs;
    this.adjustWidth();
  }
 
  onBtnExport() {
    const excludedColumns = ['action'];
    const previousColumnDefs = this.columnDefs;
    const filteredDefs = previousColumnDefs?.filter((columnDef: any) => {
      return (
        !excludedColumns.includes(columnDef.colId) &&
        !excludedColumns.includes(columnDef.headerName) &&
        !hiddenColumns.includes(columnDef.field) &&
        columnDef.hasOwnProperty('field')
      );
    });
    var params = {
      fileName: `${this.routerdata + '_PreImportSummary'+ '_' +  this.ImportSummaryDate}.xlsx`,
      sheetName:this.routerdata,
    }
    if(this.isImported==true  )
    {
      params = {
        fileName: `${this.routerdata + '_ImportSummary'+ '_' +  this.ImportSummaryDate}.xlsx`,
        sheetName:this.routerdata,
      };
    }
    const previousData : any = [];
    this.gridApi.forEachNode((node :any) => {
      previousData.push(node.data);
    })
    const rowValues = previousData.map((obj:any) => ({ ...obj }));
    for (const obj of rowValues) {
      const hasCommonKeys = Object.keys(obj).some((key) =>
      dateFieldsForImports.includes(key)
      );
      if (hasCommonKeys) {
        for (const key in obj) {
          if (dateFieldsForImports.includes(key)) {
            obj[key] = this.updateDateFormat(obj[key]);
          }
        }
      }
    }
    const filterState = this.gridApi.getFilterModel();
    const fiterStateModified = JSON.parse(JSON.stringify(filterState));
    for(let key in fiterStateModified){
      if(dateFieldsForImports.includes(key)){
        for(let index = 0; index < fiterStateModified[key]["values"].length; index++){
          fiterStateModified[key]["values"][index] = this.updateDateFormat(fiterStateModified[key]["values"][index]);
        }
      }
    }
    this.gridApi.setColumnDefs(filteredDefs || []);
    this.gridApi.setRowData(rowValues);
    this.gridApi.setFilterModel(fiterStateModified);
    this.gridApi.exportDataAsExcel(params);
    this.gridApi.setColumnDefs(previousColumnDefs || []);
    this.gridApi.setRowData(previousData);
    this.gridApi.setFilterModel(filterState);
    setTimeout(()=>{
      this.adjustWidth();
    },10);
  }

  updateDateFormat(value: string) {
    try {
      if (value == null || value.length < 10) return '';
      const date = value.substring(0, 10);
      const dateComponents = date.split('-');
      const rearrangedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
      return rearrangedDate;
    } catch (error) {
      return '';
    }
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
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }

}
