import {Component, Inject, OnInit, ViewChild, HostListener, ElementRef,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';
import { ApproveDialogComponent } from '../popup/approve-dialog/approve-dialog.component';
import { DeleteDialogComponent } from '../popup/delete-dialog/delete-dialog.component';
import { CellDoubleClickedEvent, ColDef, ColumnApi, ColumnMovedEvent, DragStartedEvent, DragStoppedEvent, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { importfile } from './importfile';
import { ApiCallService } from '../services/api-call.service';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {noActionsNoCheckBoxList,hiddenColumns,dateFields,menuId,ApprovalList, masterDataList, style,} from '../constants/app-constant';
import { HomeService } from 'src/app/services/home.service';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from '../../../app/services/loader.service';
import { DatePipe } from '@angular/common';
import { GridHeaderSelectComponent } from '../grid-header-select/grid-header-select.component';
import { PlaningService } from 'src/app/planning/services/planing.service';

@Component({
  selector: 'lib-mastergrid',
  templateUrl: './mastergrid.component.html',
  styleUrls: ['./mastergrid.component.scss'],
  providers:[DatePipe]
})
export class MastergridComponent implements OnInit {
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  permissionDetails: any;
  showApproveButton = false;
  gridColumnApi!: ColumnApi;
  showGrid = false;
  gridData: any;
  searchText = '';
  dropdownVisible = false;
  masterDataSelected = 'Select'; /// contains dropdown  value of the master
  masterDataSelectedGird = '';
  gridApi!: GridApi;
  columnApi: any;
  routerdata: any = [];
  colDefs: any = [];
  rowData: any = [];
  rowDataWithSearch: any = [];
  columns: any = [];
  gridColumns: any = [];
  userConfigColumns: any = [];
  data: any = [];
  reloadAfterSubmit = false;
  columnDefs = [{ field: '', hide: true }];
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  userProfileDetails: userProfileDetails | any;
  paginationPageSize: number = 10;
  Employnumber: number;
  approverAuthCheck: boolean;
  isShowApproveAndSendBackButtonsWithDataCheck: boolean = true;
  ExportDate :any;
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
  ColumnMoveddefs = [];
  changedcol = [];
  featureDetails: any;
  allFeatureDetails: any[] = [];
  Select: any = 'Select';
  selectedFeatureDetails: any;
  selectedMasterAccessRoles: any;
  previousPageIndex: number = 0;
  pageIndex: number = 1;
  pageSize: number = 300;
  totalCount: number = 0;
  deleteBatchSize: number = 30;
  isExport: boolean = false;
  excludedColumns = ['', 'action'];
  EmailMasterdate : string;
  filteredProviders: any[] = [];
  allProviders: any[] = [];
  selectedColumns: any;
  // Filter chips
  finalKeyArray:any=[];
  columnFilters : any;
  removedColumnFilters:any
  selectedMySubColumnNumber = 0;
  PlanningChipsKey : any;
  filterModel:any;
  filterToString : any;
  filterToParse :any;
  filterChipsSets :any = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiCallService,
    private snackBar: MatSnackBar,
    private homeService: HomeService,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
    private planningService : PlaningService,
    @Inject('MASTER_API_URL') private url: string
  ) {
    this.checkUserProfileValueValid();
    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate , 'dd-MMM-yyyy');
    this.activatedRoute.queryParams.subscribe((params)=>{
      this.EmailMasterdate = params.mastername;
    });
    // get the Master from Email Template
    //this.SelectedMasterFromEmail();

  }
  handleInput(event: KeyboardEvent): void{
    event.stopPropagation();
 }
  //drpdown with search and multi-select for vendor
  onInputChangeVendor(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.allFeatureDetails = this.allProviders.filter(({ featureName }) => {
    const prov = featureName.toLowerCase();
    return prov.includes(searchInput);
    });
  }

  onOpenChangeVendor(searchInput: any) {
    searchInput.value = "";
    this.allFeatureDetails = this.allProviders;
  }
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    // onDragStopped: (event: DragStoppedEvent) => this.onColumnMoved(event),
    // onColumnMoved: (event: ColumnMovedEvent) => this.onColumnMoved(event),
  };
  // gridOptions: GridOptions = {


  // };

  onColumnMoved(params) {
    // this.ColumnMoveddefs = params.columnApi.getColumnState();
    // for(let col of this.ColumnMoveddefs){
    // col["field"] = col.colId ;
    // }
    // for(let item of this.ColumnMoveddefs){
    //   if(item.colId == "code"){
    //     item.field ='aopPlanningCode';
    //   }
    // }
    // for(let col of this.ColumnMoveddefs){
    //   for(let item of this.columnDefs){
    //     if(col.field == item.field){
    //       col.field = item.field;
    //     }
    //   }
    //   var movedColString = [];
    //   movedColString.push(col.field);
    //   this.selectedColumns = movedColString;
    // }
    // this.columnDefs = this.ColumnMoveddefs;
  }
  onSelectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
  }
  isFirstColumn(params) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.multiSelectDropDownSearch')
      )
    ) {
      this.dropdownVisible = false;
      this.setActiveItem('');
    }
  }
  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }
  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }
  ngOnInit() {

    // get the previously selected values;


    this.activatedRoute.queryParams.subscribe((params)=>{
      this.EmailMasterdate = params.mastername;
    });
    // get the Master from Email Template
    //this.SelectedMasterFromEmail();

    this.previouslySelectedMaster();


    const storageKey = 'masterName';

    if (this.EmailMasterdate != undefined && this.EmailMasterdate!='' && this.EmailMasterdate!=null)
     {
      this.masterDataSelected = this.EmailMasterdate;
      localStorage.setItem(storageKey,this.EmailMasterdate );
    }




    if (
      this.masterDataSelected != null ||
      this.masterDataSelected != undefined ||
      this.masterDataSelected != 'Select'
    ) {
      this.showGrid = true;
      this.getMasterdata();
      // this.getMasterdataWithPagination(this.pageIndex, this.pageSize);

      for (const features of this.allFeatureDetails) {
        if (features.featureName == this.masterDataSelected) {
          this.selectedFeatureDetails = features;
        }
      }

      if (this.selectedFeatureDetails != undefined)
        this.selectedMasterAccessRoles =
          this.selectedFeatureDetails?.permissionDetails[0];

      if (
        this.masterDataSelected != undefined &&
        this.masterDataSelected != null
      )
        this.showApproveButton = ApprovalList.includes(this.masterDataSelected);
      else this.showApproveButton = false;
    }
  }

  public onMasterDataChange(event: any) {
    this.searchText = '';
    this.rowData = [];
    this.rowDataWithSearch = [];
    this.showGrid = true;
    const featureName = event.value;
    this.masterDataSelected = event.value;
    this.routerdata.title = event.value;
    this.updateLocalStorage(this.routerdata.title);
    this.gridApi.setFilterModel(null);
    for (const features of this.allFeatureDetails) {
      if (features.featureName == this.masterDataSelected) {
        this.selectedFeatureDetails = features;
      }
    }

    if (this.selectedFeatureDetails != undefined)
      this.selectedMasterAccessRoles =
        this.selectedFeatureDetails?.permissionDetails[0];

    if (this.masterDataSelected != undefined && this.masterDataSelected != null)
      this.showApproveButton = ApprovalList.includes(this.masterDataSelected);
    else this.showApproveButton = false;

    this.getMasterdata();
    // this.previousPageIndex = 0;
    // this.pageIndex = 1;
    // this.totalCount = 0;
    // this.getMasterdataWithPagination(this.pageIndex, this.pageSize);
  }

  toggleDropdown() {
    this.toggle('');
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
    }
  }

  onSearch() {
    this.rowDataWithSearch = this.rowData.filter((row: any) =>
      Object.values(row).some((value: any) => {
        if (
          value !== null &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          const lowerCaseValue = String(value).toLowerCase();
          const lowerCaseSearchText = this.searchText.toLowerCase();
          return lowerCaseValue.includes(lowerCaseSearchText);
        }
        return false;
      })
    );
    const filterState = this.gridApi.getFilterModel();
    this.gridApi.setRowData(this.rowDataWithSearch);
    this.gridApi.setFilterModel(filterState);
    this.adjustWidth();
  }

  updateLocalStorage(name: string) {
    const storageKey = 'masterName';
    localStorage.setItem(storageKey, name);
  }

  checkMasterPresent() {
    const storageKey = 'masterName';
    const value = localStorage.getItem(storageKey);

    if (!value) {
      return this.featureDetails.some((obj: any) => obj.featureName === value);
    }
    return false;
  }
  SelectedMasterFromEmail() {
    const storageKey = 'masterName';
    let EmailTemplateMaster = this.EmailMasterdate;
    // if (EmailTemplateMaster == 'undefined' || !EmailTemplateMaster) {
    //   EmailTemplateMaster = 'Select';
    // }

    if (this.EmailMasterdate != undefined && this.EmailMasterdate!='' && this.EmailMasterdate!=null)
     {
      localStorage.setItem(storageKey,this.EmailMasterdate );
      this.routerdata.title = EmailTemplateMaster;
      this.masterDataSelected = EmailTemplateMaster;
    }
  }

  previouslySelectedMaster() {
    const storageKey = 'masterName';

    let previousMaster = localStorage.getItem(storageKey);
    if (previousMaster == 'undefined' || !previousMaster) {
      previousMaster = 'Select';
    }
    this.routerdata.title = previousMaster;
    this.masterDataSelected = previousMaster;
  }

  handleLocalStorage() {
    const storageKey = 'masterName'; // Define the key for your variable in Local Storage

    // Check if the value is already present in Local Storage
    const value = localStorage.getItem(storageKey);

    if (value == 'undefined' || !value) {
      // If the value is not present or empty, update it
      const updatedValue = this.featureDetails[0].featureName;

      localStorage.setItem(storageKey, updatedValue);
      // Set the variable in the component to the updated value
      this.routerdata.title = updatedValue;
      this.masterDataSelected = updatedValue || '';
    } else {
      if (this.checkMasterPresent() == false) {
        const newValue = this.featureDetails[0].featureName || ''; // Replace this with the value you want to set

        // Save the updated value to Local Storage
        localStorage.setItem(storageKey, newValue);
      }

      const currentValue = localStorage.getItem(storageKey);
      // If the value is already present, use it
      this.routerdata.title = currentValue;
      this.masterDataSelected = currentValue || '';
    }
  }

  openFormModal(
    selectedMaster: string,
    menuId: number,
    uiJson: any,
    component = 'dynamic',
    payload: any = {},
    operation = 'create',
    viewMode = false
  ) {
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '70%',

      disableClose: true,
      data: {
        selectedMaster,
        menuId,
        uiJson,
        component,
        payload,
        operation,
        viewMode,
      },
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.reloadAfterSubmit = true;
          // this.previousPageIndex = 0;
          // this.pageIndex = 1;
          // this.totalCount = 0;
          // this.getMasterdataWithPagination(this.pageIndex, this.pageSize);

          this.getMasterdata();
        }
      }
    );
  }

  gotoMasterDetails() {
    this.router.navigate(['/details'], {
      queryParams: { routertitle: JSON.stringify(this.routerdata.title) },
    });
  }

  SaveSelectedGrid() {
    this.loaderService.setShowLoading();
    var selected: any = [];
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === false) {
        selected.push(this.columnDefs[x].field);
      }
    }

    this.apiService
      .post(
        `api/master-data/save-columns?menuId=${
          menuId[this.masterDataSelected]
        }`,
        selected
      )
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.dropdownVisible = false;
            this.showSnackbar(response.status);
            this.userConfigColumns = selected;
            return;
          } else {
            this.loaderService.setDisableLoading();
            this.dropdownVisible = false;
          }
          this.showSnackbar(response.status);
        },
        (error: any) => {
          this.loaderService.setDisableLoading();
        }
      );
  }



  toggle(col: any) {
    this.removeChips(col);
    let count = 0;
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) count += 1;

      if (this.columnDefs[x].field == col) {
        if (this.columnDefs[x].hide === false) {
          this.columnDefs[x].hide = true;
        } else {
          this.columnDefs[x].hide = false;
        }

        this.gridApi.setColumnDefs(this.columnDefs);
      }
    }

    this.adjustWidth();
  }

  dateRenderer(params: any) {
    try {
      if (params?.value == null || params?.value.length < 10) return '';
      const date = params.value.substring(0, 10);
      const dateComponents = date.split('-');

      const day = dateComponents[2];
      const month = dateComponents[1];
      const year = dateComponents[0];

      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const monthAbbreviation = monthNames[parseInt(month) - 1]; // Subtract 1 to match array index

      const rearrangedDate = `${day}-${monthAbbreviation}-${year}`;

      return `<span class="price">${rearrangedDate}</span>`;
    } catch (error) {
      return '';
    }
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

  getMasterdataWithPagination(pageIndex: number, pageSize: number) {
    this.pageIndex++;
    // this.searchText = "";

    if (this.routerdata.title == undefined) {
      if (this.allFeatureDetails != null) {
        this.routerdata.title = this.allFeatureDetails[0].featureName;
      }
    }

    if (this.masterDataSelected != undefined && this.masterDataSelected != null)
      this.showApproveButton = ApprovalList.includes(this.masterDataSelected);
    else this.showApproveButton = false;

    if (menuId[this.masterDataSelected] != undefined) {
      if (pageIndex == 1) {
        this.loaderService.setShowLoading();
        this.rowData = [];
      }

      this.apiService
        .getMasterDataWithPagination(
          pageIndex,
          pageSize,
          menuId[this.masterDataSelected]
        )
        .subscribe({
          next: (response: any) => {
            if (pageIndex == 1) {
              // loading only for first page
              this.loaderService.setDisableLoading();

              this.gridData = response;
              if (this.gridData.data.object != null) {
                if (this.gridData.data.object.length > 0) {
                  let masterTableData = this.gridData.data.object;
                  this.totalCount = this.gridData.data.object[0]?.totalRecords;
                  this.rowData = masterTableData;
                  this.onSearch();
                }
              }
              if (this.gridData.data.defaultColumns != null) {
                this.userConfigColumns = this.gridData.data.defaultColumns;
              }
              if (this.gridData.data.columnNames != null) {
                this.gridColumns = this.gridData.data.columnNames;
              }
              this.dynamicallyConfigureColumns();
              this.loaderService.setDisableLoading();

              this.gridApi.hideOverlay();
              if (
                this.rowData == null ||
                this.rowData == undefined ||
                this.rowData.length <= 0
              )
                this.gridApi.showNoRowsOverlay();
              this.reloadAfterSubmit = false;
            }
            if (pageIndex != 1) {
              if (response.data.object != null) {
                let masterTableData = response.data.object;
                this.rowData = this.rowData.concat(masterTableData);
                this.onSearch();
              }
              this.reloadAfterSubmit = false;
            }
            this.previousPageIndex = this.pageIndex - 1;
          },
          error: (e: any) => {
            this.loaderService.setDisableLoading();
          },
          complete: () => {
            this.loaderService.setDisableLoading();
          },
        });
    }
  }

  isEmployeeNoMatchesForApprove(): boolean {
    if (this.Employnumber == undefined) return true;
    for (const row of this.rowData) {
      if (parseInt(row?.ApprovalEno) === this.Employnumber) return true;
    }
    return false;
  }

  getMasterdata() {
    if (this.routerdata.title == undefined) {
      if (this.allFeatureDetails != null) {
        this.routerdata.title = this.allFeatureDetails[0].featureName;
      }
    }
    if (this.masterDataSelected != undefined && this.masterDataSelected != null)
      this.showApproveButton = ApprovalList.includes(this.masterDataSelected);
    else this.showApproveButton = false;

    if (menuId[this.masterDataSelected] != undefined) {
      if (
        this.masterDataSelected != this.masterDataSelectedGird ||
        this.reloadAfterSubmit == true ||
        true
      ) {
        this.loaderService.setShowLoading();
        this.rowData = [];
        this.apiService
          .get(`api/master-data/?menuId=${menuId[this.masterDataSelected]}`)
          .subscribe(
            (response) => {
              this.gridData = response;
              for (const obj of response.data.object) {
                const hasCommonKeys = Object.keys(obj).some((key) =>
                  dateFields.includes(key)
                );
                if (hasCommonKeys) {
                  for (const key in obj) {
                    if (dateFields.includes(key)) {
                      obj[key] = this.datePipe.transform(obj[key] , 'dd-MMM-yyyy');
                    }
                  }
                }
              }
              if (this.gridData.data.object != null) {
                if (this.gridData.data.object.length > 0) {
                  var masterTableData = this.gridData.data.object;
                  this.rowData = masterTableData;
                  this.isShowApproveAndSendBackButtonsWithDataCheck =
                    this.isEmployeeNoMatchesForApprove();
                  this.onSearch();
                }
              }

              if (this.gridData.data.defaultColumns != null) {
                this.userConfigColumns = this.gridData.data.defaultColumns;
              }
              if (this.gridData.data.columnNames != null) {
                this.gridColumns = this.gridData.data.columnNames;
              }
              this.masterDataSelectedGird = this.masterDataSelected;
              this.dynamicallyConfigureColumns();
              this.loaderService.setDisableLoading();
              // this.showLoading = false;
              this.gridApi.hideOverlay();
              if (
                this.rowData == null ||
                this.rowData == undefined ||
                this.rowData.length <= 0
              )
                this.gridApi.showNoRowsOverlay();
              this.reloadAfterSubmit = false;
              setTimeout(() => {
                this.adjustWidth();
              }, 5);
            },
            (error) => {
              this.loaderService.setDisableLoading();
            }
          );
      }
    }
  }

  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(menuId[this.masterDataSelected]).subscribe({
      next:(res:any)=>{
        let onlyKeysarr = [];
        if(res.data.columnFilters == ''){
          this.filterChipsSets = null;
          this.ClearAllChipsFiltersOnIntialLoad()
        }
        if(res.data.columnFilters != ''){
          onlyKeysarr=JSON.parse(res.data.columnFilters);
          if(onlyKeysarr){
            this.finalKeyArray =Object.keys(onlyKeysarr) ;
            this.filterChipsSets = Object.keys(onlyKeysarr)
          }
            this.gridOptions.api.setFilterModel(onlyKeysarr);
            this.loaderService.setDisableLoading();
        }
      },error:(error:any)=>{
        this.loaderService.setDisableLoading();
      }
    })
  }

  clearSelection() {
    this.agGrid.api.deselectAll();
  }

  onBtnExport() {
    const previousColumnDefs = this.columnDefs;
    const filteredDefs = previousColumnDefs?.filter((columnDef: any) => {
      return (
        !this.excludedColumns.includes(columnDef.colId) &&
        !this.excludedColumns.includes(columnDef.headerName) &&
        !hiddenColumns.includes(columnDef.field) &&
        columnDef.hasOwnProperty('field')
      );
    });

    var params = {
      fileName: `${this.routerdata.title + '_Export'+ '_' +  this.ExportDate}.xlsx`,
      sheetName:this.routerdata.title
    };

    const rowValues = this.rowDataWithSearch.map((obj: any) => ({ ...obj }));

    // for (const obj of rowValues) {
    //   const hasCommonKeys = Object.keys(obj).some((key) =>
    //     dateFields.includes(key)
    //   );
    //   if (hasCommonKeys) {
    //     for (const key in obj) {
    //       if (dateFields.includes(key)) {
    //         obj[key] = this.updateDateFormat(obj[key]);
    //       }
    //     }
    //   }
    // }
      // for (const obj of rowValues) {
      //           const hasCommonKeys = Object.keys(obj).some((key) =>
      //             dateFields.includes(key)
      //           );
      //           if (hasCommonKeys) {
      //             for (const key in obj) {
      //               if (dateFields.includes(key)) {
      //                 obj[key] = this.datePipe.transform(obj[key] , 'dd-MMM-yyyy');
      //               }
      //       }
      //   }
      // }

    const filterState = this.gridApi.getFilterModel();
    const fiterStateModified = JSON.parse(JSON.stringify(filterState));

    // for (let key in fiterStateModified) {
    //   if (dateFields.includes(key)) {
    //     for (
    //       let index = 0;
    //       index < fiterStateModified[key]['values'].length;
    //       index++
    //     ) {
    //       fiterStateModified[key]['values'][index] = this.updateDateFormat(
    //         fiterStateModified[key]['values'][index]
    //       );
    //     }
    //   }
    // }

    this.gridApi.setColumnDefs(filteredDefs || []);
    this.gridApi.setRowData(rowValues);
    this.gridApi.setFilterModel(fiterStateModified);
    this.gridApi.exportDataAsExcel(params);

    // getting it back to previous state
    this.gridApi.setColumnDefs(previousColumnDefs || []);
    this.gridApi.setRowData(this.rowDataWithSearch);
    this.gridApi.setFilterModel(filterState);

    this.adjustWidth();
  }

  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
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
  }

  actionCellRenderer1(param: any) {
    if (param.value == 1) {
      return 'Approved';
    } else if (param.value == 0) {
      return 'Reject';
    } else return 'Submitted';
  }

  capitalizeKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.capitalizeKeys);
    }

    const result: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        (result as any)[capitalizedKey] = obj[key];
      }
    }
    return result;
  }

  renderActionIconsForMaster(params: any) {
    if (
      this.allFeatureDetails.find(
        (x) => x.featureName == this.masterDataSelected
      )
    ) {
      var dataPermission = this.allFeatureDetails.find(
        (x) => x.featureName == this.masterDataSelected
      );
      if (dataPermission.permissionDetails[0] != undefined)
        this.selectedMasterAccessRoles = dataPermission.permissionDetails[0];
    }

    let iconsHTML = '<div class="icon-class">';
    const actionIconsWithSubmit: { [key: string]: string } = {
      // editPermission : '<span class="edit icon"></span>',
      readPermission: '<span class="view-grid" title="view">&#128065;</span>',
      deletePermission: '<span class="delete icon" title="delete"></span>',
      rejectPermission: '<span class="cancel icon" title="Send back"></span>',
      approvePermission: '<span class="approve icon" title="approve"></span>',

    };

    const actionIconsWithOutSubmit: { [key: string]: string } = {
      readPermission: '<span class="view-grid" title="view">&#128065;</span>',
      deletePermission: '<span class="delete icon" title="delete"></span>',
      editPermission: '<span class="edit icon" title="edit" ></span>',
    };

    if (params.data.ApproveStatus === 'Submitted') {
      for (const permission in actionIconsWithSubmit) {
        if (
          this.selectedMasterAccessRoles.hasOwnProperty(permission) &&
          this.selectedMasterAccessRoles[permission] == true
        ) {

          if (
            permission == 'approvePermission' &&
            parseInt(params.data.ApprovalEno) == this.Employnumber
          ) {
            iconsHTML += actionIconsWithSubmit[permission];
          } else if (
            permission == 'rejectPermission' &&
            parseInt(params.data.ApprovalEno) == this.Employnumber
          ) {
            iconsHTML += actionIconsWithSubmit[permission];
          } else if (permission == 'readPermission') {
            iconsHTML += actionIconsWithSubmit[permission];
          } else if (permission == 'deletePermission') {
            iconsHTML += actionIconsWithSubmit[permission];
          }
        }
      }
    } else {
      for (const permission in actionIconsWithOutSubmit) {
        if (this.selectedMasterAccessRoles != undefined) {
          if (
            this.selectedMasterAccessRoles.hasOwnProperty(permission) &&
            this.selectedMasterAccessRoles[permission] == true
          ) {
            iconsHTML += actionIconsWithOutSubmit[permission];
          }
        }
      }
    }
    iconsHTML += '</div>';

    return iconsHTML;

    if (params.data.ApproveStatus === 'Submitted') {
      // change the key and the Values to Submitted
      // edit,view,delete,approved,reject
      return '<div class="icon-class">  <span class="edit icon"></span>   <span class="view-grid">&#128065;</span>   <span class="delete icon"></span>   <span class="approve icon"></span>   <span class="cancel icon"></span> </div>';
    }
    return '<div class="icon-class" >  <span  *ngIf="masterAccessRoles.EditPermission" class="edit icon"></span>   <span class="view-grid">&#128065;</span>    <span class="delete icon"></span>  </div>';
  }

  dynamicallyConfigureColumns() {
    this.colDefs = [];

    if (this.gridData.data.columnNames != null) {
      this.gridData.data.columnNames.forEach((column: string) => {
        if (hiddenColumns.includes(column)) {
          this.colDefs.push({ field: column, hide: true, resizable: true });
        } else if (this.userConfigColumns.includes(column)) {
          if (dateFields.includes(column)) {
            this.colDefs.push({
              field: column,
              hide: false,
              resizable: true,
              // cellRenderer: this.dateRenderer,
            });
          } else {
            this.colDefs.push({ field: column, hide: false, resizable: true });
          }
        } else {
          if (dateFields.includes(column)) {
            this.colDefs.push({
              field: column,
              hide: true,
              resizable: true,
              // cellRenderer: this.dateRenderer,
            });
          } else {
            this.colDefs.push({ field: column, hide: true, resizable: true });
          }
        }
      });
    }

    if (noActionsNoCheckBoxList.includes(this.masterDataSelected) == false) {
      this.colDefs.unshift({
        headerName: '',
        hide: false,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelectionCurrentPageOnly: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        suppressMenu: true,
        maxWidth: 50,
        //headerComponentFramework: GridHeaderSelectComponent
      });

      this.colDefs.push({
        field: 'Actions',
        editable: false,
        colId: 'action',
        pinned: 'right',
        minWidth: 150,
        suppressMenu: true,
        cellRenderer: this.renderActionIconsForMaster.bind(this),
      });
    }

    this.gridApi.setColumnDefs(this.colDefs);
    this.columnDefs = this.colDefs;
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }

  showToColumnBox(param: any) {
    if (
      hiddenColumns.includes(param) ||
      param == undefined ||
      param == 'undefined'
    ) {
      return false;
    }
    return true;
  }
  showToColums(param: any) {
    if (hiddenColumns.includes(param)) {
      return false;
    }
    return true;
  }

  onCellClicked(params: any): void {
    if (params.column.colId === 'action') {
      let document = params.event.target.className;

      if (document == 'delete icon') {
        this.openDeleteDialog();
      }
      if (document == 'cancel icon') {
        this.openApproveOrRejectDialog('reject');
      }
      if (document == 'approve icon') {
        this.openApproveOrRejectDialog('approved');
      }
      if (document == 'edit icon') {
        let routeDetails = '';

        for (let index = 0; index < masterDataList.length; index++) {
          if (masterDataList[index].title === this.routerdata.title) {
            routeDetails = masterDataList[index].route;
            break;
          }
        }
        // for (const obj of params.data) {
          // const hasCommonKeys = Object.keys(params.data).some((key) =>
          //   dateFields.includes(key)
          // );
          // if (hasCommonKeys) {
          //   for (const key in params.data) {
          //     if (dateFields.includes(key)) {
          //       params.data[key] = this.datePipe.transform(params.data[key] , 'yyyy-MM-dd');
          //     }
          //   }
          // }
        // }

        if (menuId[this.masterDataSelected] === 4) {
          this.apiService
            .get(
              `api/master-data/${params.data.Id}?menuId=${
                menuId[this.masterDataSelected]
              }`
            )
            .subscribe(
              (response) => {
                this.router.navigate(['/Vendor-Master'], {
                  state: {
                    selectedMaster: this.masterDataSelected,
                    menuId: menuId[this.masterDataSelected],
                    uiJson: this.gridData.data.uiJson,
                    formType: 'static',
                    payload: this.capitalizeKeys(response.data),
                  },
                });
              },
              (error) => {
                this.loaderService.setDisableLoading();
              }
            );
        }
        else if (menuId[this.masterDataSelected] === 54) {
          this.apiService
            .get(
              `api/master-data/${params.data.Id}?menuId=${
                menuId[this.masterDataSelected]
              }`
            )
            .subscribe({
            next:(response) => {
                this.router.navigate(['/odc-master'], {
                  state: {
                    selectedMaster: this.masterDataSelected,
                    menuId: menuId[this.masterDataSelected],
                    uiJson: this.gridData.data.uiJson,
                    formType: 'static',
                    payload: this.capitalizeKeys(response.data),
                    operation:'update'
                  },
                });
              },error:
              (error) => {
                this.loaderService.setDisableLoading();
              }
        });
        }
        else {
          this.openFormModal(
            this.masterDataSelected,
            menuId[this.masterDataSelected],
            this.gridData.data.uiJson,
            'dynamic',
            params.data,
            'update'
          );
        }
        return;
      }
      if (document === 'view-grid') {
        if (menuId[this.masterDataSelected] === 4) {
          this.apiService
            .get(
              `api/master-data/${params.data.Id}?menuId=${
                menuId[this.masterDataSelected]
              }`
            )
            .subscribe(
              (response) => {
                this.router.navigate(['/Vendor-Master'], {
                  state: {
                    selectedMaster: this.masterDataSelected,
                    menuId: menuId[this.masterDataSelected],
                    uiJson: this.gridData.data.uiJson,
                    formType: 'static',
                    payload: this.capitalizeKeys(response.data),
                    read: true,
                  },
                });
              },
              (error) => {
                this.loaderService.setDisableLoading();
              }
            );
        }
        else if (menuId[this.masterDataSelected] === 54) {
          this.apiService
            .get(
              `api/master-data/${params.data.Id}?menuId=${
                menuId[this.masterDataSelected]
              }`
            )
            .subscribe(
              (response) => {
                this.router.navigate(['/odc-master'], {
                  state: {
                    selectedMaster: this.masterDataSelected,
                    menuId: menuId[this.masterDataSelected],
                    uiJson: this.gridData.data.uiJson,
                    formType: 'static',
                    payload: this.capitalizeKeys(response.data),
                    read: true,
                  },
                });
              },
              (error) => {
                this.loaderService.setDisableLoading();
              }
            );
        }
        else {
          this.openFormModal(
            this.masterDataSelected,
            menuId[this.masterDataSelected],
            this.gridData.data.uiJson,
            'dynamic',
            params.data,
            'update',
            true
          );
        }
      }
    }
  }

  openDialog() {
    if (this.routerdata.title == 'Vendor Master') {
    }
    const dialogRef = this.dialog.open(importfile, {
      width: '500px;',
      data: this.routerdata,
      minWidth: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data == 'DownloadTemplate') {
        this.onBtnExport();
      }
    });
  }

  openDialogVendor() {
    const routerDataVendor = this.routerdata;
    routerDataVendor.title = 'Vendor Master';
    const dialogRef = this.dialog.open(importfile, {
      width: '500px;',
      data: routerDataVendor,
      minWidth: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data == 'DownloadTemplate') {
        this.onBtnExport();
      }
    });
  }

  openDialogVendorContact() {
    const routerDataVendorContact = this.routerdata;
    routerDataVendorContact.title = 'Vendor Contact Details';

    const dialogRef = this.dialog.open(importfile, {
      width: '500px;',
      data: routerDataVendorContact,
      minWidth: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data == 'DownloadTemplate') {
        this.onBtnExport();
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    let remaingIdsToBeDeleted: Set<String> = new Set<String>();
    // let selectedNodes : Map<String,any> = new Map<string,any>();
    dialogRef.afterClosed().subscribe((result) => {
      var values = this.gridApi.getSelectedRows();

      if (values.length == 0) return this.showSnackbar('No Record(s) Selected');

      let selectedRowIds = [];
      for (let id of values) {
        selectedRowIds.push(id.Id);
        remaingIdsToBeDeleted.add(id.Id);
      }
      values = [];

      if (result === true) {
        this.deleteRecords(selectedRowIds, remaingIdsToBeDeleted);
      }
    });
  }

  async deleteRecords(
    seletctedRowIds: any,
    remaingIdsToBeDeleted: Set<String>
  ) {
    this.loaderService.setShowLoading();
    let batchOfIds = [];
    let seletedRecordsForDelete: Set<String> = new Set<String>();
    for (let index = 0; index < seletctedRowIds.length; index++) {
      // to call the api as a list
      batchOfIds.push(seletctedRowIds[index]);
      // to filter data for soft delelte
      seletedRecordsForDelete.add(seletctedRowIds[index]);
      // after batch is deleted remaining records to be shown as marked
      remaingIdsToBeDeleted.delete(seletctedRowIds[index]);

      if (batchOfIds.length == this.deleteBatchSize) {
        const response = await this.apiService
          .delete(`api/master-data?menuId=${menuId[this.masterDataSelected]}`, {
            menuId: menuId[this.masterDataSelected],
            ids: batchOfIds,
          })
          .toPromise();

        this.softDeleteTheRecords(
          seletedRecordsForDelete,
          remaingIdsToBeDeleted
        );
        batchOfIds = [];
        seletedRecordsForDelete = new Set<String>();
      }
    }
    if (batchOfIds.length != 0) {
      const response = await this.apiService
        .delete(`api/master-data?menuId=${menuId[this.masterDataSelected]}`, {
          menuId: menuId[this.masterDataSelected],
          ids: batchOfIds,
        })
        .toPromise();
      this.softDeleteTheRecords(seletedRecordsForDelete, remaingIdsToBeDeleted);
      batchOfIds = [];
      seletedRecordsForDelete = new Set<String>();
    }
    this.loaderService.setDisableLoading();
  }

  softDeleteTheRecords(
    selectedRowsIds: Set<String>,
    remaingIdsToBeDeleted: Set<String>
  ) {
    this.rowData = this.rowData.filter(
      (obj: any) => !selectedRowsIds.has(obj.Id)
    );
    this.rowDataWithSearch = this.rowDataWithSearch.filter(
      (obj: any) => !selectedRowsIds.has(obj.Id)
    );
    const filterState = this.gridApi.getFilterModel();
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFilterModel(filterState);
  }
  typeCheckingStatus(status: any) {
    let getSelectedRows = this.gridApi.getSelectedRows();

    let statusValue = status === 'approved' ? 'Approve' : 'Reject';

    for (const obj of getSelectedRows) {
      if (obj.ApproveStatus !== 'Submitted') {
        this.showSnackbar(
          `Cannot ${statusValue} selected Record(s) Only Submitted Records can be ${statusValue}`
        );
        return false;
      }
    }

    return true;
  }

  openApproveOrRejectDialog(status: string = 'approved'): void {
    let statusCode: any;
    if (status !== 'approved') {
      statusCode = 3;
    } else {
      statusCode = 2;
    }
    let dilogTitle = '';
    var selectedRows = this.gridApi.getSelectedRows();
    for (let item of selectedRows) {
      if (parseInt(item.ApprovalEno) == this.Employnumber) {
        // if True
        this.approverAuthCheck = true;
      } else {
        //When false
        this.approverAuthCheck = false;
        return this.showSnackbar('Unautherize approver');
      }
    }
    if (this.approverAuthCheck) {
      if (this.typeCheckingStatus(status) == false) return;

      if (status === 'approved') {
        dilogTitle = 'Are you sure you want to Approve ?';
      } else {
        dilogTitle = 'Are you sure you want to send back?';
      }
      const dialogRef = this.dialog.open(ApproveDialogComponent, {
        width: '50%',
        disableClose: true,
        data: {
          title: dilogTitle,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result.yes === true) {
          // User clicked Yes, do something
          var values = this.gridApi.getSelectedRows();
          if (values.length == 0)
            return this.showSnackbar('No Record(s) Selected');
          if (status === 'approved') {
            this.loaderService.setShowLoading();
            var values = this.gridApi.getSelectedRows();
            let selectedRowIds = [];
            for (let id of values) {
              selectedRowIds.push(id.Id);
            }
            this.apiService.postApprovalProcess(menuId[this.masterDataSelected],selectedRowIds,statusCode,result.remark)
              .subscribe((response: any) => {
                this.loaderService.setShowLoading();
                if (
                  response.status === 'Record(s) Approved successfully.' ||
                  true
                ) {
                  this.loaderService.setDisableLoading();
                  this.reloadAfterSubmit = true;
                  // this.previousPageIndex = 0;
                  // this.pageIndex = 1;
                  // this.totalCount = 0;
                  // this.getMasterdataWithPagination(this.pageIndex, this.pageSize);
                  this.getMasterdata();

                  return this.showSnackbar(response.status);
                }
              });
          } else {
            this.loaderService.setShowLoading();
            let selectedRowIds = [];
            for (let id of values) {
              selectedRowIds.push(id.Id);
            }
            this.apiService.postApprovalProcess(menuId[this.masterDataSelected],selectedRowIds,statusCode,result.remark)
              .subscribe((response: any) => {
                this.loaderService.setShowLoading();
                if (response.status === 'Record(s) Rejected successfully.') {
                  this.loaderService.setDisableLoading();
                  this.reloadAfterSubmit = true;
                  // this.previousPageIndex = 0;
                  // this.pageIndex = 1;
                  // this.totalCount = 0;
                  // this.getMasterdataWithPagination(this.pageIndex, this.pageSize);
                  this.getMasterdata();
                  return this.showSnackbar(response.status);
                }
              });
          }
        } else {
          // User clicked No or closed the dialog, do something else
        }
      });
    }
  }

  create() {
    if (menuId[this.masterDataSelected] === 4) {
      this.router.navigate(['/Vendor-Master'], {
        state: {
          selectedMaster: this.masterDataSelected,
          menuId: menuId[this.masterDataSelected],
          uiJson: this.gridData.data.uiJson,
          formType: 'static',
          operation: 'create',
        },
      });
    }
   else if(menuId[this.masterDataSelected] === 54){
      this.router.navigate(['/odc-master'], {
        state: {
          selectedMaster: this.masterDataSelected,
          menuId: menuId[this.masterDataSelected],
          uiJson: this.gridData.data.uiJson,
          formType: 'static',
          operation: 'create',
        },
      });
    }
     else {
      this.openFormModal(
        this.masterDataSelected,
        menuId[this.masterDataSelected],
        this.gridData.data.uiJson
      );
    }
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getProfileRoles() {
    if (this.masterDataSelected == undefined) {
      this.masterDataSelected = 'Billing Period Master';
      this.routerdata.title = 'Billing Period Master';
    }
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.userProfileDetails = response.data;
        this.Employnumber = this.userProfileDetails.employeeNumber;
        this.apiService.profileDetails = response.data;
        StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails))
        if (
          this.apiService.profileDetails != null &&
          this.apiService.profileDetails != undefined
        ) {
          this.userProfileDetails = this.apiService.profileDetails;
          if (this.userProfileDetails.roleDetail != null) {
            const masterDataModules =
              this.userProfileDetails.roleDetail[0].roleDetails.filter(
                (item: any) =>
                  item.moduleDetails.some(
                    (module: any) => module.moduleName === 'MasterData'
                  )
              );
            const masterDataFeatureDetails = masterDataModules.map(
              (item: any) => {
                const masterDataModule = item.moduleDetails.find(
                  (module: any) => module.moduleName === 'MasterData'
                );
                return masterDataModule.featureDetails;
              }
            );
            this.featureDetails = masterDataFeatureDetails;

            for (let plan of this.featureDetails) {
              for (let item of plan) {
                if (
                  item.featureName == null ||
                  item.featureName == '' ||
                  item.featureName == undefined
                ) {
                  //do nothing
                } else {
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
                  };

                  for (const permission in this.permissionDetails) {
                    if (item.permissionDetails[0] != undefined) {
                      if (
                        this.allFeatureDetails.filter(
                          (report) => report.featureName === item.featureName
                        ).length > 0 &&
                        this.allFeatureDetails.filter(
                          (report) => report.featureName === item.featureName
                        ) != undefined
                      ) {
                        var updatedFeature = this.allFeatureDetails.filter(
                          (report) => report.featureName === item.featureName
                        )[0];

                        if (
                          updatedFeature != undefined &&
                          updatedFeature != null
                        ) {
                          var getUpdatedFeaturePermission =
                            updatedFeature['permissionDetails'];

                          if (item.permissionDetails[0][permission] == true) {
                            this.permissionDetails[permission] = true;
                          }
                          if (
                            getUpdatedFeaturePermission[0][permission] == true
                          ) {
                            this.permissionDetails[permission] = true;
                          }
                        }
                      } else if (
                        item.permissionDetails[0].hasOwnProperty(permission) &&
                        item.permissionDetails[0][permission] == true
                      ) {
                        this.permissionDetails[permission] = true;
                      }
                    }
                  }
                  if (
                    this.allFeatureDetails.filter(
                      (report) => report.featureName === item.featureName
                    )
                  ) {
                    if (
                      this.allFeatureDetails.find(
                        (x) => x.featureName == item.featureName
                      )
                    ) {
                      this.allFeatureDetails.splice(
                        this.allFeatureDetails.findIndex(
                          (x) => x.featureName == item.featureName
                        ),
                        1
                      );
                    }
                  }
                  item.permissionDetails[0] = this.permissionDetails;
                  this.allFeatureDetails.push(item);
                  if (item.featureName == this.masterDataSelected) {
                    this.selectedFeatureDetails = item;
                  }
                }
                const NewFeatures: any = ([] = this.allFeatureDetails);
                
              }
            }
            this.allFeatureDetails.sort((a: any, b: any) =>
              a.featureName.localeCompare(b.featureName)
            );
          }
        }
      },
      error: (e: any) => {
      },
      complete: () => {},
    });
    this.allProviders = this.allFeatureDetails ;
  }

  checkUserProfileValueValid() {
    this.apiService.profileDetails = StorageQuery.getUserProfile();
    if (
      this.apiService.profileDetails == '' ||
      this.apiService.profileDetails == undefined
    ) {
      this.getProfileRoles();
    } else {
      this.userProfileDetails = this.apiService.profileDetails;
      this.Employnumber = this.userProfileDetails.employeeNumber;
      const masterDataModules =
        this.userProfileDetails.roleDetail[0].roleDetails.filter((item: any) =>
          item.moduleDetails.some(
            (module: any) => module.moduleName === 'MasterData'
          )
        );
      const masterDataFeatureDetails = masterDataModules.map((item: any) => {
        const masterDataModule = item.moduleDetails.find(
          (module: any) => module.moduleName === 'MasterData'
        );
        return masterDataModule.featureDetails;
      });

      this.featureDetails = masterDataFeatureDetails;
      for (let plan of this.featureDetails) {
        for (let item of plan) {
          if (
            item.featureName == null ||
            item.featureName == '' ||
            item.featureName == undefined
          ) {
            //do nothing
          } else {
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
            };

            for (const permission in this.permissionDetails) {
              if (item.permissionDetails[0] != undefined) {
                if (
                  this.allFeatureDetails.filter(
                    (report) => report.featureName === item.featureName
                  ).length > 0 &&
                  this.allFeatureDetails.filter(
                    (report) => report.featureName === item.featureName
                  ) != undefined
                ) {
                  var updatedFeature = this.allFeatureDetails.filter(
                    (report) => report.featureName === item.featureName
                  )[0];
                  if (updatedFeature != undefined && updatedFeature != null) {
                    var getUpdatedFeaturePermission =
                      updatedFeature['permissionDetails'];

                    if (item.permissionDetails[0][permission] == true) {
                      this.permissionDetails[permission] = true;
                    }
                    if (getUpdatedFeaturePermission[0][permission] == true) {
                      this.permissionDetails[permission] = true;
                    }
                  }
                } else if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.permissionDetails[permission] = true;
                }
              }
            }
            if (
              this.allFeatureDetails.filter(
                (report) => report.featureName === item.featureName
              )
            ) {
              if (
                this.allFeatureDetails.find(
                  (x) => x.featureName == item.featureName
                )
              ) {
                this.allFeatureDetails.splice(
                  this.allFeatureDetails.findIndex(
                    (x) => x.featureName == item.featureName
                  ),
                  1
                );
              }
            }
            item.permissionDetails[0] = this.permissionDetails;
            this.allFeatureDetails.push(item);
           
          }
        }
      }
      this.allFeatureDetails.sort((a: any, b: any) =>
        a.featureName.localeCompare(b.featureName)
      );
      if (this.masterDataSelected == undefined) {
        this.masterDataSelected = 'Select';
        this.routerdata.title = 'Select';
      }
      for (const features of this.allFeatureDetails) {
        if (features.featureName == this.masterDataSelected) {
          this.selectedFeatureDetails = features;
        }
      }
    }
    this.allProviders = this.allFeatureDetails;
  }

  onPaginationChanged(event: any) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
    return;
    if (
      this.totalCount == 0 ||
      this.totalCount < (this.pageIndex - 1) * this.pageSize
    ) {
    } else {
      // this.pageIndex++;
      if (this.pageIndex == this.previousPageIndex + 1)
        this.getMasterdataWithPagination(this.pageIndex, this.pageSize);
    }

    if (this.rowData.length == this.totalCount && this.isExport == true) {
      this.isExport = false;
      this.onBtnExport();
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


  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }
  resetAllColumnsInConfig() {
    this.dropdownVisible = false;
    for (let x = 0; x < this.columnDefs.length; x++) {
      if (
        !hiddenColumns.includes(this.columnDefs[x].field) &&
        this.columnDefs[x].hide === true
      ) {
        this.columnDefs[x].hide = false;
      }
    }
    this.gridApi.setColumnDefs(this.columnDefs);
    this.adjustWidth();
  }
  selectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.field ) {
        if (
          !hiddenColumns.includes(this.columnDefs[i].field) &&
          this.columnDefs[i].hide === true
        ) {
          this.columnDefs[i].hide = false;
        }
        // this.columnDefs[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = this.columnDefs
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
    this.adjustWidth();
  }
  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.field) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = [];
    this.adjustWidth();
  }
  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => {
        x.field && x.hide == true
      }
    ).length;

  }

  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel(); //same
    this.filterToString =  JSON.stringify(this.filterModel);

    this.filterToParse = JSON.parse(this.filterToString);
    this.filterChipsSets = Object.keys(this.filterToParse);
    this.adjustWidth();
  }
  saveChipsFilters(){
    this.loaderService.setShowLoading();
  // API
   var payload: any = {
    menuid: menuId[this.masterDataSelected],
      filters: JSON.stringify(this.filterModel),
    }
    this.planningService.saveColFilters(payload).subscribe({
      next:(res:any)=>{
        this.columnFilters =  res.data.columnFilters;
        let onlyKeysarr= [];
        onlyKeysarr = JSON.parse(this.columnFilters);
        this.filterChipsSets = Object.keys(onlyKeysarr);
        this.finalKeyArray = Object.keys(onlyKeysarr) ;
        this.adjustWidth();
        this.loaderService.setDisableLoading();
        this.showSnackbar('Filter saved Successfully.')
      },
      error:(error:any)=>{
        this.loaderService.setDisableLoading();
      }
    })
    // api
  }
  getCapitalize(item:any) {
    return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/(\B[A-Z])/g, ' $1').replace('Ntid','NT ID').replace('I D','ID').replace('Enddate','End date').replace('Bu','BU').replace('Jd','JD').replace('Personnel Subarea','Personnel Subarea BGS').replace('Contract End','Contract End(SOW JD)')
  }
  removeChips(f:any) {
    let onlyKeysarr=[];
    const index = this.filterChipsSets.indexOf(f);
    if (index >= 0) {
      this.filterChipsSets.splice(index, 1);
      onlyKeysarr = JSON.parse(this.filterToString);
      delete onlyKeysarr[f];
      this.filterToString = JSON.stringify(onlyKeysarr);
      let onlyKeysarr2=[];
      onlyKeysarr2 = JSON.parse(this.filterToString);
      this.gridOptions.api.setFilterModel(onlyKeysarr2);
      this.adjustWidth();

      this.loaderService.setDisableLoading();
      var removepayload: any = {
        menuid: menuId[this.masterDataSelected],
          filters: JSON.stringify(onlyKeysarr),
        }
      this.planningService.saveColFilters(removepayload).subscribe({
        next:(res:any)=>{
          this.removedColumnFilters =  res.data.columnFilters; //chips name with value received from API
          let onlyKeysarr2=[];
          onlyKeysarr2=JSON.parse(this.removedColumnFilters);
          this.gridOptions.api.setFilterModel(onlyKeysarr2);
          this.filterChipsSets = Object.keys(onlyKeysarr2) ;
          this.adjustWidth();
          this.loaderService.setDisableLoading();
        },
        error:(error:any)=>{
        }
      })
    }
  }
  ClearAllChipsFiltersOnIntialLoad(){
    this.filterChipsSets=[];
    var payload: any = {
      menuid: menuId[this.masterDataSelected],
        filters: '',
      }
      this.planningService.saveColFilters(payload).subscribe({
        next:(res:any)=>{
          this.adjustWidth();
        },
        error:(error:any)=>{

        }
      })
    this.gridOptions.api.setFilterModel(null);

  }
  ClearAllChipsFilters(){
    this.loaderService.setShowLoading();
    this.filterChipsSets=[];
    var payload: any = {
      menuid: menuId[this.masterDataSelected],
        filters: '',
      }
      this.planningService.saveColFilters(payload).subscribe({
        next:(res:any)=>{
          console.log("filter response",res);
          this.loaderService.setDisableLoading();
          this.adjustWidth();
          this.showSnackbar('Filter cleared Successfully.')
        },
        error:(error:any)=>{
          this.loaderService.setDisableLoading();

        }
      })
    this.gridOptions.api.setFilterModel(null);
  }
}
