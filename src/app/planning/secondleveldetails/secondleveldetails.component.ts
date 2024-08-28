import { Component, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, IDetailCellRendererParams } from 'ag-grid-community';
import { PlanningListService } from '../services/planning-list.service';
import { EditSEcondLevelPlanningComponent } from '../popups/edit-second-level-planning/edit-second-level-planning.component';
import { PlaningService } from '../services/planing.service';
 import { ConfirmationpopupComponent } from '../popups/confirmationpopup/confirmationpopup.component';
import { AddresourceComponent } from '../popups/addresource/addresource.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { CancelSLPComponent } from '../popups/cancel-slp/cancel-slp.component';
import { ApproveSLPComponent } from '../popups/approve-slp/approve-slp.component';
import { HostListener } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { DelegateSecondlevelComponent } from '../popups/delegate-secondlevel/delegate-secondlevel.component';
import { OwnershipComponent } from '../popups/ownership/ownership.component';
import { LoaderService } from 'src/app/services/loader.service';
import { ImportresourceComponent } from './importresource/importresource.component';
import { DeletePoConfirmComponent } from '../popups/delete-po-confirm/delete-po-confirm.component';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';
@Component({
  selector: 'app-secondleveldetails',
  templateUrl: './secondleveldetails.component.html',
  styleUrls: ['./secondleveldetails.component.css'],
  providers:[DatePipe,CurrencyPipe,NumericFormatPipe]
})
export class SecondleveldetailsComponent {
  queryParamValue: string | null = '';
  private gridApi!: GridApi;
  private gridApi_1st!: GridApi;
  private gridApi_Remarks!: GridApi;
  private gridColumnApi!: ColumnApi;
  isGridAPIReady: boolean = true;
  remarks:any;
  remarksList: any[] = [];
  data: any;
  aopPlanningData: any;
  receivedData: any;
  selectedOption = 2023;
  public gridOptions: GridOptions = {};
  public rowData = [];
  public showLoading = false;
  public SecondLevelId :any;
  public dataGrid :any = []
  public metadata : any;
  stayScrolledToEnd = true;
  SecondLevelStatus : string;
  startDateMonth  = 0
  StartMonth :any ;
  selectedRowGroups: string[] = [];
  ownerEno : number;
  finalApprovalActivitySPOCId : number ;
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  overlayNoRowsTemplate = '<span></span>';
  public defaultColDef: ColDef = {
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
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  Monthlist = [
    {mon:"jan",value:0},
    {mon:"feb",value:1},
    {mon:"mar",value:2},
    {mon:"apr",value:3},
    {mon:"may",value:4},
    {mon:"jun",value:5},
    {mon:"jul",value:6},
    {mon:"aug",value:7},
    {mon:"sep",value:8},
    {mon:"oct",value:9},
    {mon:"nov",value:10},
    {mon:"dec",value:11},
  ]
  permissionDetails :any ;
  employnumber :number
  public apiResponse: any = [];
  paginationPageSize: number = 5;
  columnApi: any;
  // AUTH
  featureDetails : any ;  
  userProfileDetails : userProfileDetails | any ;
  osmRole : boolean = false;
  osmRoleAdmin : boolean = false;
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private planningListService: PlanningListService,
    private planningService : PlaningService, private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private planningservice : PlaningService,
    private homeService: HomeService,
    private loaderService: LoaderService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    this.checkUserProfileValueValid();
    this.route.queryParams.subscribe((query: any) => {
      this.SecondLevelId = query.id;
    });
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event:any) {
  }
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  } 

    // FLP Cycle AUTH functions
  getProfileRoles() {
       this.loaderService.setShowLoading();
     this.homeService.getProfileRoles()
      .subscribe({
        next: (response: any) => {
          this.userProfileDetails = response.data;
          this.employnumber = this.userProfileDetails.employeeNumber;
          for (let role of this.userProfileDetails.roleDetail[0].roleDetails) {
            if (role.roleName.toLowerCase() == "osm") {
              this.osmRole = true;
            }
            if (role.roleName.toLowerCase().startsWith("osm admin")) {
              this.osmRoleAdmin = true;
            }
          }

          this.planningService.profileDetails = response.data;
          StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
          const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item: any) => item.moduleDetails.some((module: any) => module.moduleName === "Planning"));
          const masterDataFeatureDetails = masterDataModules.map((item: any) => {
            const masterDataModule = item.moduleDetails.find((module: any) => module.moduleName === "Planning");
            return masterDataModule.featureDetails;
          });
          this.featureDetails = masterDataFeatureDetails;
          this.permissionDetails = {
            "createPermission": false,
            "readPermission": false,
            "editPermission": false,
            "deletePermission": false,
            "approvePermission": false,
            "rejectPermission": false,
            "delegatePermission": false,
            "withdrawPermission": false,
            "importPermission": false,
            "exportPermission": false,
            "ownershipChangePermission":false
          };
          for (let plan of this.featureDetails) {
            for (let item of plan) {
              if (item.featureCode.startsWith("CFCyclePlanning")) {
                item.id = "0";
              } else if (item.featureCode.startsWith("AOPPlanning")) {
                item.id = "1";
              } else if (item.featureCode.startsWith("FirstLevelPlanning")) {
                item.id = "2";
              } else if (item.featureCode.startsWith("SecondLevelPlanning")) {
                item.id = "3";
              } else if (item.featureCode.startsWith("PODetails")) {
                item.id = "4";
              }
            }
            const sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
            plan = sorttest2;
            for (let item of plan) {
              if (item.featureCode.toLowerCase() == "secondlevelplanning") {
                for (const permission in this.permissionDetails) {
                  if (item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true) {
                    this.permissionDetails[permission] = true;
                  }
                }
              }
            }
          }
          this.loaderService.setDisableLoading();
        },
        error: (e: any) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {
          this.loaderService.setDisableLoading();
        }
      });
  }
  checkUserProfileValueValid(){
      this.loaderService.setShowLoading();
      this.planningService.profileDetails = StorageQuery.getUserProfile();
      if(this.planningService.profileDetails == '' || this.planningService.profileDetails == undefined) {
        this.getProfileRoles();
      }
      else {
        this.userProfileDetails = this.planningService.profileDetails;
        this.employnumber = this.userProfileDetails.employeeNumber;
        for(let role of this.userProfileDetails.roleDetail[0].roleDetails){
          if(role.roleName.toLowerCase() == "osm"){
            this.osmRole = true;
          }
          if(role.roleName.toLowerCase().startsWith("osm admin")){
            this.osmRoleAdmin = true;
          }
        }
        const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning"));         
        const masterDataFeatureDetails = masterDataModules.map((item:any) => {
          const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
          return masterDataModule.featureDetails;
        });
        this.featureDetails = masterDataFeatureDetails;
        this.permissionDetails = {
          "createPermission": false,
          "readPermission": false,
          "editPermission": false,
          "deletePermission": false,
          "approvePermission": false,
          "rejectPermission": false,
          "delegatePermission": false,
          "withdrawPermission": false,
          "importPermission": false,
          "exportPermission": false
        }
        for(let plan of this.featureDetails){
          for(let item of plan){        
            if(item.featureCode.startsWith("CFCyclePlanning")){
              item.id = "0";
            }else if(item.featureCode.startsWith("AOPPlanning")){
              item.id = "1";
            } else if(item.featureCode.startsWith("FirstLevelPlanning")){
              item.id = "2";
            } else if(item.featureCode.startsWith("SecondLevelPlanning")){
              item.id = "3";
            } else if(item.featureCode.startsWith("PODetails")){
              item.id = "4";
            } 
          }  
          const sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
          plan = sorttest2 ;
          for(let item of plan){
            if(item.featureCode.toLowerCase() == "secondlevelplanning"){
              for (const permission in this.permissionDetails) {
                if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                  this.permissionDetails[permission] = true;
                }
              }
            } 
          }     
        }  
      }
      this.loaderService.setDisableLoading();
  }

  
 ngOnInit(){
    // if(this.permissionDetails.readPermission){
      this.loaderService.setShowLoading();
      this.getSecondLevelDetail();
    // }else{
    //   this.router.navigate(['Planning/Access Denied'])
      
    // }
   
  }
  getSecondLevelDetail(){
    this.loaderService.setShowLoading();
    this.planningService.GetSecondLevelDetails(this.SecondLevelId).subscribe({
      next: (res:any) => {
        this.companyCurrencyName = res?.data?.metadata?.currency;
        let currencyObj = this.loaderService.getCountryDetailByCurrency(
          this.companyCurrencyName
        );
        this.companyLocale = currencyObj.locale;
        this.companyNumericFormat = currencyObj.numericFormat;
        this.apiResponse = res.data;       
        for(let month of this.Monthlist){
          if(this.apiResponse.metadata.cfCycleMonth.toLowerCase() == month.mon){
            this.StartMonth = month.value;
          }
        }
        res.data.metadata["duedays"] = this.calculateDiff(res.data.metadata.startDate,res.data.metadata.endDate);
        res.data.metadata.startDate = this.datePipe.transform(res.data.metadata.startDate, 'dd-MMM-yyyy');
        res.data.metadata.endDate = this.datePipe.transform(res.data.metadata.endDate, 'dd-MMM-yyyy');
        this.dataGrid = res.data.dataGrid;
        this.metadata = res.data.metadata;
        this.ownerEno = parseInt(this.metadata.ownerEno);
        this.finalApprovalActivitySPOCId = parseInt(this.metadata.finalApprovalActivitySPOCId)
        for(let item of res.data.dataGrid){
          item.duedays = this.calculateDiff(res.data.metadata.startDate,res.data.metadata.endDate);
          if(this.ownerEno == this.employnumber){
            item.permittedEdit = true
          }else{
            item.permittedEdit = false;
          }
         
        }
        this.rowData = res.data.dataGrid;
        this.rowData.forEach((obj:any)=>{
          for(let item of obj.children){
            for(let month of this.Monthlist){
              if(item.group == "Projected Revenue"){
                item[month.mon] = this.currencyPipe.transform(item[month.mon],this.companyCurrencyName,this.companyLocale);
              }else{
                item[month.mon] =  this.numericFormatPipe.transform(item[month.mon],this.companyLocale,this.companyNumericFormat)
              }
            }

          }
        })
        this.gridApi.setRowData(this.rowData);
        
        this.aopPlanningData = this.planningListService.getAopPlanning();
        this.loaderService.setDisableLoading();
        setTimeout(() => {
          this.adjustWidth();
        }, 5);      
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });
  }
  calculateDiff(startdate:any,enddate:any){
    let todayDate = new Date();
    let sentOnDate = new Date(enddate);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
    return differenceInDays;
  }
  downloadTemplate(featureCode:string) {
  var griddata = {}
  griddata["featureCode"] = featureCode;
  griddata["id"] = this.metadata.aopSlId
    this.loaderService.setShowLoading();
    this.planningService.ExportGrid(griddata)
      .subscribe({
        next:(response: any) => {
          let receivedBase64String = '';
          let filename = '';        
          filename = response.data.fileName;
          receivedBase64String = response.data.fileBase64;

          const link = document.createElement('a');
          link.href =
            'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
            receivedBase64String;
          link.download = filename;
          link.click();
          this.loaderService.setDisableLoading();
        },error:(error) => {
          this.loaderService.setDisableLoading();
        }
    });
  }


  getStatusColor(status: string): string {
    if (status === 'Submitted') {
      return 'green';
    } else if (status === 'Rejected') {
      return 'red';
    } else if (status === 'Approved') {
      return 'green';
    } else if (status === 'Cancelled') {
      return '#f5c77e';
    }else if (status === 'Delegated' || status === 'Delegate') {
      return '#0061cf';
    }
    return ''; // Default color
  }

  onRowGroupOpened(event: any) {
    if (event.node.expanded) {
      
      // Collapse the previously expanded group, if any
      this.selectedRowGroups.forEach((groupName) => {
        if (groupName !== event.rowIndex) {
          const node = this.gridApi.getRowNode(groupName);
          if (node) {
            node.setExpanded(false);
          }
        }
      });
  
      // Update the currently expanded group
      this.selectedRowGroups = [event.node.rowIndex];
    } else {
      // Remove the collapsed group from the tracking list
      const index = this.selectedRowGroups.indexOf(event.node.rowIndex);
      if (index !== -1) {
        this.selectedRowGroups.splice(index, 1);
      }
    }
  }

  handleScroll(event: any) {
    this.gridApi.setAlwaysShowHorizontalScroll(true);
    const grid = document.getElementById('planningGrid');
    if (grid) {
      const gridBody = grid.querySelector('.ag-body-viewport') as any;
      const scrollPos = gridBody.offsetHeight + event.top;
      const scrollDiff = gridBody.scrollHeight - scrollPos;
      this.stayScrolledToEnd = scrollDiff <= 3;
    }
  }
  goBackToPlanning(){
    this.router.navigate(['/planning']);
  }

  public columnDefs: ColDef[] = []

  public groupDefaultExpanded = 0;
  public detailRowHeight = 240;
  

  detailCellRendererParams: any = {
    // level 3 grid options
    detailGridOptions: {
      editType: 'fullRow',
      columnDefs: [
        { 
          headerName: 'Group',
          field: 'group', 
          resizable: true,
          hide:false,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'SL No.',
          field:'SerialNo',
          hide:true
        },
        { 
          headerName: 'Jan',
          field: "jan",
          minWidth:80,
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Feb',
          field: "feb", 
          minWidth: 80, 
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Mar',
          field: "mar", 
          minWidth: 80,
          resizable:true,  
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Apr',
          field: "apr",
           minWidth: 80,
           resizable:true ,
           enableFilter:false,
           suppressMenu: true,
           suppressDragLeaveHidesColumns: false,
           suppressMovable:true
          },
        { 
          headerName: 'May',
          field: "may", 
          minWidth: 80, 
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Jun',
          field: "jun", 
          minWidth: 80,
          resizable:true,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Jul',
          field: "jul", 
          minWidth: 80, 
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Aug',
          field: "aug", 
          minWidth: 80,
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Sep',
          field: "sep", 
          minWidth: 80,
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Oct',
          field: "oct", 
          minWidth: 80,
          resizable:true,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Nov',
          field: "nov", 
          minWidth: 80,
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
        { 
          headerName: 'Dec',
          field: "dec", 
          minWidth: 80,
          resizable:true ,
          enableFilter:false,
          suppressMenu: true,
          suppressDragLeaveHidesColumns: false,
          suppressMovable:true
        },
      ], 
      detailRowHeight: 155,
    },

    getDetailRowData: (params) => {
      params.successCallback(params.data.children);
    },
  } as IDetailCellRendererParams;

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
    this.columnDefs =
    [
      { 
        headerName: 'SkillSet',
        field: 'skillset' , 
        cellRenderer: 'agGroupCellRenderer',
        resizable:true,
    },
      { 
        headerName: 'Grade',
        field: 'grade',
        resizable:true 
      },
      { 
        headerName: 'Location Mode',
        field: 'locationMode',
        resizable:true
      },
      { 
        headerName: 'Location',
        field: 'location',
        resizable:true
      },
      { 
        headerName: 'Vendor',
        field: 'vendor',
        resizable:true
      },
      { 
        headerName: 'GB',
        field: 'gb',
        resizable:true
      },
      { 
        headerName: 'Skillset Type',
        field: 'skillsetType',
        resizable:true
      },
      { 
        headerName: 'VKM Price',
        field: 'vkM_Price',
        resizable:true,
        cellRenderer: (params: any) =>
          this.currencyPipe.transform(
            params.data.vkM_Price,
            this.companyCurrencyName,
            this.companyLocale
          ),
      },
      { 
        headerName: 'Initial Capacity',
        field: 'ending_Number',
        resizable:true,
        cellRenderer: (params: any) =>
          this.numericFormatPipe.transform(
            params.data.ending_Number,
            this.companyLocale,
            this.companyNumericFormat
          ),
      },
      {
        headerName: 'End Capacity',
        field:'endCapacity',
        resizable:true,
        cellRenderer: (params: any) =>
          this.numericFormatPipe.transform(
            params.data.endCapacity,
            this.companyLocale,
            this.companyNumericFormat
          ),
      },
      { 
        headerName: 'Equivalent Capacity',
        field: 'equivalent_Capacity',
        resizable:true,
        cellRenderer: (params: any) =>
          this.numericFormatPipe.transform(
            params.data.equivalent_Capacity,
            this.companyLocale,
            this.companyNumericFormat
          ), 
      },
      { 
        headerName: 'Projected PO',
        field: 'projected_PO' ,
        resizable:true,
        cellRenderer: (params: any) =>
          this.numericFormatPipe.transform(
            params.data.projected_PO,
            this.companyLocale,
            this.companyNumericFormat
          ), 
      },
      { 
        headerName: 'Projected Revenue',
        field: 'projected_Revenue' ,
        resizable:true,
        cellRenderer: (params: any) =>
          this.currencyPipe.transform(
            params.data.projected_Revenue,
            this.companyCurrencyName,
            this.companyLocale
          ),
      },
    ];
    this.columnDefs.push(
      {
      headerName: 'Actions',
      editable: false,
      pinned: 'right',
      field: 'Action',
      minWidth: 80,
      colId:"Action",
      cellRenderer: this.renderActionIconsForMaster.bind(this),
      },
    );
  this.gridApi.setColumnDefs(this.columnDefs);
  this.gridApi.hideOverlay();
  this.adjustWidth();
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }


  customEditableFunction(params: any): boolean {
    const nonNumericFields = ['group']; // Add field names that should not be editable
    return (
      params.node.rowIndex === 0 &&
      !nonNumericFields.includes(params.colDef.field)
    );
  }

  onGridReady_Remarks(params:any) {
    this.gridApi_Remarks = params.api;
  }

  onCellValueChanged(params: any) {
    const { node, colDef, newValue, oldValue } = params;
    const selectedLevel = params.data.parentid;
    const SelectedMonth = params.colDef.field;

    const newValueAsNumber = Number(newValue);
    if (isNaN(newValueAsNumber) || !/^[\d+\-*/.() ]+$/.test(newValue)) {
      // You can display an error message or handle the validation error here
      return;
    }

    const rowData: any = [];
    this.gridApi.forEachNode((node) => {
      rowData.push(node.data);
    });
    for (const level1 of rowData) {
      if (level1.id === selectedLevel) {
        let index = 0;
        for (const level2 of level1.children) {
          index++;
          if (index !== 1) level2[SelectedMonth] = newValueAsNumber * 10;
        }
      }
    }

    this.gridApi.setRowData(rowData);
    return;
  }

  actionCellRenderer_2st_level_Planning(params: any) {   
    var currentRowData = params.data.status;
    if(params.data.permittedEdit){
      if (currentRowData == 'Planning Initiated' || currentRowData == 'Rejected') {
        return (
          `<div style="display:flex; align-items:center">` +
          '<span style="display:flex;align-items:center;color: #007bc0";font-size:12px;><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>' +
          `</div>`
        );    
      }else{
        return ''
      }
    }else{
      return '';
    }

  }
  renderActionIconsForMaster(params: any){
    let iconsHTML = '<div class="icon-class">';
    const actionIconsWithSubmit: { [key: string]: string } = {
      editPermission :   `<div style="display:flex; align-items:center">` +
      '<span style="display:flex;align-items:center;color: #007bc0";font-size:12px;><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>' +
      `</div>`,
      deletePermission:`&nbsp;&nbsp;<span class="deleteblueskillset" title="Delete">&nbsp;&nbsp;</span>`
    };
    

    const actionIconsWithOutSubmit: { [key: string]: string } = {
      editPermission :   `<div style="display:flex; align-items:center">` +
      '<span style="display:flex;align-items:center;color: #007bc0";font-size:12px;><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>' +
      `</div>`,
    };
if(params.data.duedays <= 0){
    if(params.data.status == 'Planning Initiated' || params.data.status == 'Rejected'){
      for (const permission in actionIconsWithSubmit) {
        if (this.permissionDetails.hasOwnProperty(permission) && this.permissionDetails[permission] == true) {
          if(permission == "editPermission"){
            if(params.data.permittedEdit  || this.osmRoleAdmin){
                iconsHTML +=  actionIconsWithSubmit[permission]; 
            }
          }
          if(permission == "deletePermission"){
            if(params.data.isImported ==  false){
              iconsHTML +=  actionIconsWithSubmit[permission]; 
          }

          }
        }
      }

    }
  }
    iconsHTML += '</div>';
    return iconsHTML;
  }
  importResource(){
    const dialogRef = this.dialog.open(ImportresourceComponent, {
        width: '500px;',
        data: this.metadata,
        minWidth: '500px',
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        // if (result.data == 'DownloadTemplate') {
        //   this.onBtnExport();
        // }
      });

  }
  exportResource(){
    var griddata = {}
    griddata["id"] = this.metadata.aopSlId
      this.loaderService.setShowLoading();
      this.planningService.ExportSecondLevelGrid(griddata)
        .subscribe({
          next:(response: any) => {
            let receivedBase64String = '';
            let filename = '';        
            filename = response.data.fileName;
            receivedBase64String = response.data.fileBase64;
  
            const link = document.createElement('a');
            link.href =
              'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
              receivedBase64String;
            link.download = filename;
            link.click();
            this.loaderService.setDisableLoading();
          },error:(error) => {
            this.loaderService.setDisableLoading();
          }
      });

  }
  openDelegate_secondLevel(status:string) {
    const dialogRef = this.dialog.open(DelegateSecondlevelComponent,{
      width: '50%',
      data: {message: this.metadata,status:status},
      panelClass: 'scrollable-dialog'
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted == true) {
         this.loaderService.setShowLoading();
        this.getSecondLevelDetail();  
        location.reload();      }
    });
  }

  openEditPopup(payload: any) {
    const dialogRef = this.dialog.open(EditSEcondLevelPlanningComponent, {
      width: '80%',
      hasBackdrop: false,
      data: { message: payload,buName:this.metadata.businessUnit,companycode:this.metadata.companyCode },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted == true) {
        this.getSecondLevelDetail();
         this.loaderService.setShowLoading();
        setTimeout(()=>{                          
          this.loaderService.setDisableLoading();
      }, 3000);       
      }else{
        this.getSecondLevelDetail();
      }
    });
  }
  onremarks(event :any){
    this.remarks = event.target.value
  }

  openAddResourcePopup() {
    this.metadata.startMonth =   this.StartMonth;  // This line adds the start month in Interger
    const dialogRef = this.dialog.open(AddresourceComponent, {
      width: '100%',
      hasBackdrop: false,
      data: { message: this.metadata,startDateMonth: this.startDateMonth,buName:this.metadata.businessUnit },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted == true) {
         this.loaderService.setShowLoading();
        this.getSecondLevelDetail(); 
        location.reload();       
         setTimeout(()=>{                    
          this.loaderService.setDisableLoading();
      }, 3000);     
      }
    });
  }
  Confirmation(title:string){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      width: '30%',
      data: { title: title },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result ==  true){
        if(title == 'Cancel' || title == 'Submit'){
          const updateaop:any = {}
          updateaop["id"]  = this.SecondLevelId,
          updateaop["status"] = title,
          updateaop["remark"] = 'Remark',
          this.planningService.updateaopsl(updateaop).subscribe({
            next: (res:any) => {
              if(res.data == "Success"){
                this.showSnackbar(`Second Level Planning ${title}`);
              }
            },
            
            error: (e:any) => {
            },
            complete: () => {
            }
          });
        }
      }
    });
  }
  openWithdrawPlanning(status:any) {
    this.aopPlanningData["aopSlId"] = this.SecondLevelId;
    var data : any = [] ;
    if(this.aopPlanningData.length == 0){
       data = this.metadata ;
       data["aopSlId"] = this.SecondLevelId;
    }else{
      data  = this.aopPlanningData;
    }
    const dialogRef = this.dialog.open(ApproveSLPComponent,{
      width: '50%',
      data: {message: data,status:status},
      panelClass: 'scrollable-dialog'
    });
  
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted == true) {
         this.loaderService.setShowLoading();
        this.getSecondLevelDetail(); 
        location.reload();      
      }
    });
  }
  
  onCellClicked(params: any): void {
    if (params.column.colId === 'Action') {
      let document = params.event.target.innerText;
      if (document === 'edit') {
        params.data.startMonth =   this.StartMonth;  // This line adds the start month in Interger
        params.data.valueIn = this.metadata.valueIn;
        params.data.companyId = this.metadata.companyId ;
        this.openEditPopup(params.data);
      
      }
      else if (
        params.colDef.field === 'Action' &&
        params.event.target.className == 'deleteblueskillset'
      ) {
        this.deleteSupplyPlanning(params.data);
      }
    }
  }
  deleteSupplyPlanning(params:any){
    const dialogRef: MatDialogRef<DeletePoConfirmComponent> = this.dialog.open(
      DeletePoConfirmComponent,
      {
        width: '25%',
        data: params,});
  
    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
         this.DeletePOApiCall(params.id)
        }
      }
    );
     

  }
  DeletePOApiCall(id:any){
    this.planningService.deleteSupplyPlanning(id).subscribe({
      next:(res:any)=>{        
        if(res.status == "Record deleted successfully."){
          this.showSnackbar(res.status);
          this.getSecondLevelDetail();
          this.loaderService.setDisableLoading();
        }else{
          this.loaderService.setDisableLoading();
        }
      }
      })
   }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  ngOnChanges(changes: SimpleChanges): void {
  if (this.isGridAPIReady && changes['rowData']) {
      this.gridOptions.api?.setRowData(this.rowData);
    }
  }

  onPanelOpened() {
     this.loaderService.setShowLoading();
    const staticdata :any = {}
      staticdata["aopSlId"]  = this.metadata.aopSlId;
  
    this.planningService.getRemarks(staticdata).subscribe({
      next: (res:any) => {
        this.loaderService.setDisableLoading();
        this.remarksList = res.data;  
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });
    this.remarksList = this.remarksList[0].data;
  }
  OpenOwnershipDialog(featureCode:string,ownerEno:string){
   let ownerno = parseInt(ownerEno)
    const dialogRef = this.dialog.open(OwnershipComponent,{
      width: '50%',
      data: {objectId:this.metadata.aopSlId,featureCode:featureCode,ownerEno:ownerno},
      panelClass: 'scrollable-dialog'
    });
  
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted == true) {
         this.loaderService.setShowLoading();
        this.getSecondLevelDetail();    
        location.reload();      }
    });

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
}