import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlaningService } from '../services/planing.service';
import { PoplanningComponent } from '../popups/poplanning/poplanning.component';
import { PoplanningeditComponent } from '../popups/poplanningedit/poplanningedit.component';
import { PoViewOnlyComponent } from '../popups/po-view-only/po-view-only.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ColDef,ColumnApi,GridApi,GridReadyEvent,IDetailCellRendererParams,GridOptions,} from 'ag-grid-community';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HomeService } from 'src/app/services/home.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { DeletePoConfirmComponent } from '../popups/delete-po-confirm/delete-po-confirm.component';
import { OwnershipComponent } from '../popups/ownership/ownership.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-poplandetails',
  templateUrl: './poplandetails.component.html',
  styleUrls: ['./poplandetails.component.css'],
})
export class PoplandetailsComponent implements OnInit {
  data: any;
  poPlanningData: any;
  private gridApi!: GridApi;
  showLoading = false;

  public groupDefaultExpanded = 0;
  // public POPlanningId :any;

  isEditable: boolean = false;
  buttonText: string = 'View';

  poOrganizationUnitId: any;
  selectedYear: any;
  orgLevel: any = '';
  companyShortName: any = '';
  companyId: any = '';
  planningLevel: any = '';
  dataParameters: any = {};
  permissionDetails :any ;
  ShowEditicon : boolean ;
  showSubmitIcon :  boolean = false;
  activitySpocId : number;
  Employnumber : number;
  AnnualPlanningId :any ;


   // AUTH
   featureDetails : any ;  
   userProfileDetails : userProfileDetails | any ;
   osmRole : boolean = false;
   osmRoleAdmin : boolean = false;    
  paginationPageSize: number = 5;
   columnApi: any;


  constructor(
    private dialog: MatDialog,
    private planningService: PlaningService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private homeService: HomeService,
    private loaderService: LoaderService,
  ) {
    this.checkUserProfileValueValid();
    this.route.queryParams.subscribe((query: any) => {
      this.poOrganizationUnitId = query.id;
      this.selectedYear = query.year;
      this.orgLevel = query.orgLevel;
      this.companyShortName = query.companyShortName;
      this.companyId = query.companyId;
      this.planningLevel = query.planningLevel;
      this.AnnualPlanningId = query.AnnualPlanningId;
    });
  }
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  } 

    // PO Cycle AUTH functions
         // PO  AUTH functions
         getProfileRoles() {
           this.loaderService.setShowLoading();
         this.homeService.getProfileRoles()
         .subscribe({
           next: (response:any) => {
             this.userProfileDetails = response.data;
             this.Employnumber = this.userProfileDetails.employeeNumber;
             for(let role of this.userProfileDetails.roleDetail[0].roleDetails){
              if(role.roleName.toLowerCase() == "osm"){
                this.osmRole = true;
              }
              if(role.roleName.toLowerCase().startsWith("osm admin")){
                this.osmRoleAdmin = true;
              }
            }
             this.planningService.profileDetails = response.data;
             StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
             const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "MasterData"));
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
                 if(item.featureCode.toLowerCase() == "podetails"){
                   for (const permission in this.permissionDetails) {
                     if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                       this.permissionDetails[permission] = true;
                     }
                   }
               } 
               }     
             }
             this.loaderService.setDisableLoading();
           },
           error: (e:any) => {
             this.loaderService.setDisableLoading();
           },
           complete: () => {
             this.loaderService.setDisableLoading();
           }
        });
      }
      checkUserProfileValueValid(){
          this.planningService.profileDetails = StorageQuery.getUserProfile();
          if(this.planningService.profileDetails == '' || this.planningService.profileDetails == undefined) {
            this.getProfileRoles();
          }
          else {
            this.userProfileDetails = this.planningService.profileDetails;
            this.Employnumber = this.userProfileDetails.employeeNumber;
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
                if(item.featureCode.toLowerCase() == "podetails"){
                  for (const permission in this.permissionDetails) {
                    if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                      this.permissionDetails[permission] = true;
                    }
                  }
              } 
              }     
            }  
          }
      }

  ngOnInit(): void {
      this.dataParameters['organizationUnitId'] = this.poOrganizationUnitId;
      this.dataParameters['companyId'] = this.companyId;
      this.dataParameters['cfcycleyear'] = this.selectedYear;
      this.dataParameters['planningOrgLevel'] = this.orgLevel;
      this.dataParameters['planningLevel'] = this.planningLevel;
      this.dataParameters['AnnualPlanningId'] = this.AnnualPlanningId;
  
      this.getPoDetails(this.dataParameters);   
    this.poPlanningData = this.planningService.getDetailsData();
  }

  columnDefs: any = [
    {
      headerName: 'No',
      field: 'no',
      cellRenderer: 'agGroupCellRenderer',
      resizable: false,
      maxWidth:80,
      filter : false,
      suppressMenu : true
    },
    { headerName: 'Id', field: 'id', hide: true, resizable: true },
    { headerName: 'Vendor', field: 'vendor', minWidth: 260, resizable: true },
    { headerName: 'Location', field: 'location', resizable: true },
    { headerName: 'BP', field: 'bp', resizable: true },
    { 
      headerName: 'CF02', 
      field: 'cF02', 
      resizable: true,
      cellRenderer: this.cf02diffrence,
    },
    { 
      headerName: 'CF03', 
      field: 'cF03', 
      resizable: true,
      cellRenderer: this.cf03diffrence, 
    },
    { 
      headerName: 'CF04', 
      field: 'cF04', 
      resizable: true,
      cellRenderer: this.cf04diffrence, 
    },
    { 
      headerName: 'CF05', 
      field: 'cF05', 
      resizable: true,
      cellRenderer: this.cf05diffrence,
    },
    { 
      headerName: 'CF06', 
      field: 'cF06', 
      resizable: true,
      cellRenderer: this.cf06diffrence, 
    },
    { 
      headerName: 'CF07', 
      field: 'cF07', 
      resizable: true,
      cellRenderer: this.cf07diffrence, 
    },
    { 
      headerName: 'CF08', 
      field: 'cF08', 
      resizable: true,
      cellRenderer: this.cf08diffrence,
    },
    { 
      headerName: 'CF09', 
      field: 'cF09', 
      resizable: true,
      cellRenderer: this.cf09diffrence,
    },
    { 
      headerName: 'CF10', 
      field: 'cF10', 
      resizable: true,
      cellRenderer: this.cf010diffrence, 
    },
    { 
      headerName: 'CF11', 
      field: 'cF11', 
      resizable: true,
      cellRenderer: this.cf011diffrence, 
    },
    { 
      headerName: 'CF12', 
      field: 'cF12', 
      resizable: true ,
      cellRenderer: this.cf012diffrence,
    },
    { headerName: 'PO Value', field: 'poValues' },
    {
      field: 'actions',
      headerName: 'Add PO',
      editable: false,
      colId: 'action',
      pinned: 'right',
      minWidth: 150,
      suppressMenu: true,
      cellRenderer: this.renderActionIcons.bind(this),
    },
  ];

  apiResponseWithChildrenModified: any = [];
  dateFields = [
    'ModifiedOn',
    'CreatedOn',
    'ValidFrom',
    'ValidTo',
    'ValidityStart',
    'ValidityEnd',
    'DocumentData',
    'PeriodStart',
    'PeriodEnd',
    'CFCyclePlanningStartDate',
    'CFCyclePlanningEndate',
    'ValidityStart',
    'ValidityEnd',
    'DocumentDate',
    'DeliveryDate',
    'VendorInvoiceDate',
    'PostingDate',
    'StartDate',
    'DateofLeaving',
    'ContEnd',
    'ApprovedDate',
  ];

  rowData: any = [];
  onGridReady(params: any) {
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
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }

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

  detailCellRendererParams: any = {
    // level 3 grid options
    detailGridOptions: {
      columnDefs: [
        { headerName: 'PO Number', field: 'poNumber' },
        {
          headerName: 'Created Date',
          field: 'createdDate',
          cellRenderer: this.dateRenderer,
          resizable: true,
        },
        {
          headerName: 'Changed Date',
          field: 'changedDate',
          cellRenderer: this.dateRenderer,
          resizable: true,
        },
        {
          headerName: 'Delivery Date',
          field: 'deliveryDate',
          cellRenderer: this.dateRenderer,
          resizable: true,
        },
        {
          headerName: 'Validity Start',
          field: 'validityStart',
          cellRenderer: this.dateRenderer,
          resizable: true,
        },
        {
          headerName: 'Validity End',
          field: 'validityEnd',
          cellRenderer: this.dateRenderer,
          resizable: true,
        },
        { headerName: 'Fund Center', field: 'fundCenter', resizable: true },
        { headerName: 'Cost Center', field: 'costCenter', resizable: true },
        { headerName: 'Fund', field: 'fund', resizable: true },
        { headerName: 'Budget Code', field: 'budgetCode', resizable: true },
        { headerName: 'Currency', field: 'currency', resizable: true },
        { headerName: 'PO Value', field: 'poValue', resizable: true },
        {
          headerName: 'Actions',
          field: 'actionChildren',
          colId: 'actionChildren',
          pinned: 'right',
          minWidth: 150,
          suppressMenu: true,
          cellRenderer: this.renderActionIconsForChildren.bind(this),
        },
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 170,
        wrapText: true,
        autoHeight: true,
      },
      detailRowHeight: 155,
      onCellClicked: this.onDetailCellClicked.bind(this),
    },

    getDetailRowData: (params) => {
      params.successCallback(params.data.children);
    },
  } as IDetailCellRendererParams;

  renderActionIcons(params: any) {
    if (this.isEditable && this.permissionDetails.editPermission == true) {
      return '<div class="cfcycleicons">&nbsp;<span class="addaop" title="Add PO">&nbsp;</span></div>'
      
    }
    return ''
  }

  renderActionIconsForChildren(params: any) {
    if (this.isEditable) {
      return '<div class="cfcycleicons">&nbsp;&nbsp;<span class="deleteblueskillset" title="Delete">&nbsp;&nbsp;</span></div>'
    
    }
    return ``;
   
  }

  onCellClicked(event: any) {
    if (
      event.colDef.field === 'actions' &&
      event.event.target.className == 'addaop'
    ) {
      this.openPopup(event.data);
    }
  }


  onDetailCellClicked(event: any) {
    if (
      event.column.colId == 'actionChildren' &&
      event.event.target.className == 'blue-edit_planning'
    ) {
      this.openEditPopup(event.data);
    } else if (
      event.column.colId == 'actionChildren' &&
      event.event.target.className == 'view-grid'
    ) {
      this.openOnlyViewPopUp(event.data);
    }
    else if (
      event.colDef.field === 'actionChildren' &&
      event.event.target.className == 'deleteblueskillset'
    ) {
      // let document = event.event.target.className;
      this.DeletePO(event.data);
    }
  }
  DeletePO(params:any){
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
    this.planningService.DeletePO(id).subscribe({
      next:(res:any)=>{        
        if(res.status == "PO deleted successfully"){
          this.showSnackbar(res.status);
          this.getPoDetails(this.dataParameters);
          this.loaderService.setDisableLoading();
        }else{
          this.loaderService.setDisableLoading();
        }
      }
      })
   }

  openPopup(data: any) {
    const dialogRef: MatDialogRef<PoplanningComponent> = this.dialog.open(
      PoplanningComponent,
      {
        width: '57%',
        data: data,
        // You can add more options and data to pass to the popup component if needed
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getPoDetails(this.dataParameters);        }
      }
    );
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

  openOnlyViewPopUp(data: any) {
    const dialogRef: MatDialogRef<PoViewOnlyComponent> = this.dialog.open(
      PoViewOnlyComponent,
      {
        data: data,
        width: '70%',

        // You can add more options and data to pass to the popup component if needed
      }
    );

  }

  openEditPopup(data: any) {
    const dialogRef: MatDialogRef<PoplanningeditComponent> = this.dialog.open(
      PoplanningeditComponent,
      {
        data: data,
        width: '70%',

        // You can add more options and data to pass to the popup component if needed
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getPoDetails(this.dataParameters);
        }
      }
    );
  }
  showEdit() {
    this.isEditable = !this.isEditable;
    this.showSubmitIcon = true;
    this.ShowEditicon = false ;
    this.gridApi.setRowData(this.rowData);
  }
  showSubmit(){
    this.showSubmitIcon = false;
    this.ShowEditicon = true ;
    this.showSnackbar("Record Submitted Successfully")
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  goBackToPlanning() {
    this.router.navigate(['/planning']);
  }
  cf02diffrence(params: any){
      if(params.data.cF02 > 0){
        return (
          "<span>" + params.data.cF02  + '(' + params.data.cF02Diff + ')' + "</span>"
        );
      }else{
        return (
          "<span>" + params.data.cF02  + "</span>"
        );
    }
  }
  cf03diffrence(params: any){
      if(params.data.cF03 > 0){
        return (
          "<span>" + params.data.cF03  + '(' + params.data.cF03Diff + ')' + "</span>"
        );
      }else{
        return (
          "<span>" + params.data.cF03  + "</span>"
        );
      }
  }
  cf04diffrence(params: any){
    if(params.data.cF04 > 0){
      return (
        "<span>" + params.data.cF04  + '(' + params.data.cF04Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF04  + "</span>"
      );
    }
  }
  cf05diffrence(params: any){
    if(params.data.cF05 > 0){
      return (
        "<span>" + params.data.cF05  + '(' + params.data.cF05Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF05  + "</span>"
      );
    }
  }
  cf06diffrence(params: any){
    if(params.data.cF06 > 0){
      return (
        "<span>" + params.data.cF06  + '(' + params.data.cF06Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF06  + "</span>"
      );
    }
  }
  cf07diffrence(params: any){
    if(params.data.cF07 > 0){
      return (
        "<span>" + params.data.cF07  + '(' + params.data.cF07Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF07  + "</span>"
      );
    }
  }
  cf08diffrence(params: any){
    if(params.data.cF08 > 0){
      return (
        "<span>" + params.data.cF08  + '(' + params.data.cF08Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF08  + "</span>"
      );
    }
  }
  cf09diffrence(params: any){
    if(params.data.cF09 > 0){
      return (
        "<span>" + params.data.cF09  + '(' + params.data.cF09Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF09  + "</span>"
      );
    }
  }
  cf010diffrence(params: any){
    if(params.data.cF10 > 0){
      return (
        "<span>" + params.data.cF10  + '(' + params.data.cF10Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF10  + "</span>"
      );
    }
  }
  cf011diffrence(params: any){
    if(params.data.cF11 > 0){
      return (
        "<span>" + params.data.cF11  + '(' + params.data.cF11Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF11  + "</span>"
      );
    }
  }
  cf012diffrence(params: any){
    if(params.data.cF12 > 0){
      return (
        "<span>" + params.data.cF12  + '(' + params.data.cF12Diff + ')' + "</span>"
      );
    }else{
      return (
        "<span>" + params.data.cF12  + "</span>"
      );
    }
  }

  getPoDetails(data: any) {
    
     this.loaderService.setShowLoading();
    this.planningService.getPoDetails(data).subscribe({
      next: (response: any) => {
        this.rowData = response.data.dataGrid;
        for(let item of this.rowData){
          if( item.cF02 != null) {
            item.cF02Diff =  item.cF02 - item.bp;
          };
          if( item.cF03 != null) {
            item.cF03Diff =  item.cF03 - item.bp
          };
          if( item.cF04 != null) {
            item.cF04Diff =  item.cF04 - item.bp
          };
          if( item.cF05 != null) {
            item.cF05Diff =  item.cF05 - item.bp
          };
          if( item.cF06 != null) {
            item.cF06Diff =  item.cF06 - item.bp
          };
          if( item.cF07 != null) {
            item.cF07Diff =  item.cF07 - item.bp
          };
          if( item.cF08 != null) {
            item.cF08Diff =  item.cF08 - item.bp
          };
          if( item.cF09 != null) {
            item.cF09Diff =  item.cF09 - item.bp
          };
          if( item.cF10 != null) {
            item.cF10Diff =  item.cF10 - item.bp
          };
          if( item.cF11 != null) {
            item.cF11Diff =  item.cF11 - item.bp
          };
          if( item.cF12 != null) {
            item.cF12Diff =  item.cF12 - item.bp
          };
        }
        this.poPlanningData = response.data.metadata;
        this.activitySpocId = parseInt(this.poPlanningData.ownerEno);
        if(this.permissionDetails.editPermission == true &&  this.activitySpocId == this.Employnumber){
          this.ShowEditicon = true;
        }else{
          this.ShowEditicon = false;
        }
        setTimeout(() => {
          this.adjustWidth();
        }, 5); 

      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  OpenOwnershipDialog(featureCode:string,ownerEno:string){
    let ownerno = parseInt(ownerEno)
     const dialogRef = this.dialog.open(OwnershipComponent,{
       width: '50%',
       data: {UniqueId: this.poPlanningData.poPlanningId,featureCode:featureCode,ownerEno:ownerno},
       panelClass: 'scrollable-dialog'
     });
   
     dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
       if (isFormSubmitted) {
          this.loaderService.setShowLoading();
         this.getPoDetails(this.dataParameters);
         this.gridApi.setRowData(this.rowData);
         this.adjustWidth();      
       }
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

const keyMappingObject = {
  location: 'location',
  locationId: 'locationId',
  vendor: 'vendor',
  vendorID: 'vendorID',
  organizationUnitId: 'organizationUnitId',
  organizationUnit: 'organizationUnit',
  id: 'id',
  parentid: 'parentid',
  purchaseOrderNumber: 'PONumber',
  createdDate: 'CreatedDate',
  changedDate: 'ChangedDate',
  deliveryDate: 'DeliveryDate',
  validityStart: 'ValidityStart',
  validityEnd: 'validityEnd',
  FundCenterId: 'FundCenterId',
  fundCenter: 'FundCenter',
  CostCenterId: 'CostCenterId',
  costCenter: 'CostCenter',
  fund: 'Fund',
  budgetCode: 'BudgetCode',
  currency: 'Currency',
  poValue: 'POValue',
};
