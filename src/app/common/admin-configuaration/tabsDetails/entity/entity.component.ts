import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AdminconfigService } from '../../../adminconfig.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import {AddUpdateEntityComponent} from '../popup/add-update-entity/add-update-entity.component';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})

export class EntityComponent  implements OnInit{

  ngOnInit(): void {  
  }

  private gridApi!: GridApi;

  constructor(
    private adminConfigService: AdminconfigService,
    private dialog: MatDialog,
    public loaderService : LoaderService 
  ) {}

  gridOptions : GridOptions = {
    domLayout: 'autoHeight',    
  };

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

  rowData = []
  columnDefs: ColDef[] = [
    { headerName : "Entity Name", field : "entityName"},
    { headerName : "Entity Full Name", field: "entityFullName"},
    { headerName: "Company Code", field : "companyCode"},
    // { headerName: "Is Deleted", field: "isDeleted", hide:true},
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.actionRenderer,
    },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getEntities();
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>   <span class="delete icon" title="delete"></span> <div>`;
  }

  statusRenderer(params: any) {
    if (params.value == true) {
      return `<div class="icon-class">   <span class="approve"></span>  <div>`;
    } 
    return '';
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.updateEntity(params.data);
    }

    else if(
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ){
      this.deleteEntity(params.data.id);
    }
  }
  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }

  getEntities(){
    this.loaderService.setShowLoading();
    this.adminConfigService.getEntities().subscribe({
      next: (response: any) => {
        this.rowData = response.data;
        this.resetFilters();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  addEntity(){
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateEntityComponent> = this.dialog.open(AddUpdateEntityComponent, {
      data: dataToBePassed,
      width: '70%',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntities();
        }
      }
    );
  }
  updateEntity(_data: any){
    
    const dataToBePassed = {
      operation: 'update',
      data: _data,
    };

    const dialogRef: MatDialogRef<AddUpdateEntityComponent> = this.dialog.open(AddUpdateEntityComponent, {
      data: dataToBePassed,
      width: '70%',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntities();
        }
      }
    );
  }

  deleteEntity(_id : string){
    const dataToBePassed = {
      operation: 'delete',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateEntityComponent> = this.dialog.open(AddUpdateEntityComponent, {
      data: dataToBePassed,
      width: '30%',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntities();
        }
      }
    );
  }

}
