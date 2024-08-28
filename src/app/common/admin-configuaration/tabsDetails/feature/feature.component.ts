import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AdminconfigService } from '../../../adminconfig.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { AddUpdateFeatureComponent } from '../popup/add-update-feature/add-update-feature.component';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css'],
})
export class FeatureComponent implements OnInit {
  ngOnInit(): void {}

  private gridApi!: GridApi;

  constructor(
    private adminConfigService: AdminconfigService,
    private dialog: MatDialog,
    public loaderService: LoaderService
  ) {}

  gridOptions: GridOptions = {
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

  rowData = [];
  columnDefs: ColDef[] = [
    { headerName: 'Feature Name', field: 'featureName' },
    { headerName: 'Feature Description', field: 'featureDescription' },
    { headerName: 'URL Path', field: 'urlPath' },
    { headerName: 'Feature Code', field: 'featureCode' },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.actionRenderer,
    },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getFeatures();
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>   <span class="delete icon" title="delete"></span> <div>`;
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.updateFeature(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.deleteFeature(params.data.id);
    }
  }

  getFeatures() {
    this.loaderService.setShowLoading();
    this.adminConfigService.getFeatures().subscribe({
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

  addFeature() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateFeatureComponent> = this.dialog.open(
      AddUpdateFeatureComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getFeatures();
        }
      }
    );
  }

  updateFeature(_data: any) {
    const dataToBePassed = {
      operation: 'update',
      data: _data,
    };

    const dialogRef: MatDialogRef<AddUpdateFeatureComponent> = this.dialog.open(
      AddUpdateFeatureComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getFeatures();
        }
      }
    );
  }
  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }

  deleteFeature(_id: string) {
    const dataToBePassed = {
      operation: 'delete',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateFeatureComponent> = this.dialog.open(
      AddUpdateFeatureComponent,
      {
        data: dataToBePassed,
        width: '30%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getFeatures();
        }
      }
    );
  }
}
