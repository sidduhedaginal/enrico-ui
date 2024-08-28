import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { StatusComponent } from '../shared/status/status.component';
import { EditDeleteActionsComponent } from '../shared/edit-delete-actions/edit-delete-actions.component';
import { MobileNumberComponent } from '../shared/mobile-number/mobile-number.component';
import { EditVendorDetailsComponent } from '../edit-vendor-details/edit-vendor-details.component';
import { VendorDetailsService } from '../services/vendor-details.service';
import { ColDef, DomLayoutType, ValueGetterParams } from 'ag-grid-community';
import { DeleteComponent } from '../delete/delete.component';
import { SuccessComponent } from '../success/success.component';
import 'ag-grid-enterprise';
import { PrimaryContactComponent } from '../shared/primary-contact/primary-contact.component';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorService } from '../services/vendor.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'lib-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css'],
})
export class VendorDetailsComponent implements OnInit {
  title = 'Vendor Details';
  vendorSAPId: number;
  vendorId: string;
  public dialogConfig: any;
  heading = 'Update Vendor Details';
  vendorDetail: any;
  contact_Detail: any[] = [];
  subsidaryDetails: any[] = [];
  pagination: boolean = true;
  paginationPageSize: number = 5;

  errorMessage = '';
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private vendorDetailsService: VendorDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService,
    private loaderService: LoaderService
  ) {
    this.vendorId = this.vendorService.vendorId;
    this.vendorSAPId = this.vendorService.vendorSAPId;
  }

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.vendorDetailsService
      .getVendorDetails(this.vendorSAPId)
      .subscribe((response: any) => {
        if (response.data !== null) {
          this.loaderService.setDisableLoading();
          this.vendorDetail = response.data[0];
        }
      });
    this.vendorDetailsService
      .getSubsidaryDetails(this.vendorId)
      .subscribe((response: any) => {
        if (response.data !== null) {
          this.loaderService.setDisableLoading();
          this.subsidaryDetails = response.data;
        }
      });
    this.vendorDetailsService
      .getContactDetails(this.vendorId)
      .subscribe((response: any) => {
        if (response.data !== null) {
          this.loaderService.setDisableLoading();
          this.contact_Detail = response.data;
        }
      });
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.disableClose = true;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.backdropClass = 'bdrop';
  }

  onGrid2Ready(params: any) {
    this.grid2Api = params.api;
  }

  grid2Api: any;
  grid1Api: any;

  onGridReadyContactInfo(params: any) {
    this.grid1Api = params.api;
    this.grid1Api.setDomLayout('autoHeight');
    this.grid1Api.setRowData(this.contact_Detail);
  }

  onGridReadySubsidiaries(params: any) {
    this.grid2Api = params.api;
    this.grid2Api.setDomLayout('autoHeight');
    this.grid2Api.setRowData(this.subsidaryDetails);
  }
  hashValueGetter(params: ValueGetterParams) {
    return params.node ? params.node.rowIndex : null;
  }

  columnDefsContactInfo = [
    // {headerName: 'No',maxWidth: 100,valueGetter: this.hashValueGetter,suppressMenu: true,editable: false},
    {
      headerName: 'Contact Name',
      field: 'contactName',
      editable: false,
      cellRenderer: PrimaryContactComponent,
    },
    { headerName: 'Email', field: 'email', editable: false, minWidth: 250 },
    {
      headerName: 'Mobile Number',
      field: 'mobile',
      editable: false,
      cellRenderer: MobileNumberComponent,
    },
    { headerName: 'Designation', field: 'designation', editable: false },
    {
      headerName: 'Domain Responsibility',
      field: 'domainResponsibility',
      editable: false,
    },
    {
      headerName: 'Escalation Level',
      field: 'escalationLevelValue',
      editable: false,
    },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusComponent,
      suppressMenu: true,
      editable: false,
    },
    {
      headerName: 'Action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      suppressMenu: true,
      editable: false,
      cellRendererParams: {
        edit: (params: any) => {
          let dialogRef = this.dialog.open(
            ContactDetailsComponent,
            this.dialogConfig
          );
          let data = { IsCreate: false, contact: params.data };
          let instance = dialogRef.componentInstance;
          instance.contactInput = data;
          dialogRef.afterClosed().subscribe((res) => {
            if (res.data != null) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = res.data;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.vendorDetailsService
                .getContactDetails(this.vendorId)
                .subscribe((response: any) => {
                  if ((response.data != null) != null) {
                    this.contact_Detail = response.data;
                    this.grid1Api.setRowData(this.ContactInfo);
                  }
                });
            }
          });
        },
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data !== null && res?.data == 'yes') {
              let input = { id: params.data.id };
              this.vendorDetailsService
                .deleteContactDetails(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    let dialogRef = this.dialog.open(
                      SuccessComponent,
                      this.dialogConfig
                    );
                    let message = response.data[0].message;
                    let instance = dialogRef.componentInstance;
                    instance.message = message;
                    this.vendorDetailsService
                      .getContactDetails(this.vendorId)
                      .subscribe((response: any) => {
                        if ((response.data != null) != null) {
                          this.contact_Detail = response.data;
                          this.grid1Api.setRowData(this.ContactInfo);
                        }
                      });
                  }
                });
            }
          });
        },
      },
    },
  ];
  ContactInfo: any[] = [];
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: false,
    filter: true,
    menuTabs: ['filterMenuTab'],
  };

  columnDefsSubsidiaries = [
    // {headerName: 'No',maxWidth: 100,valueGetter: this.hashValueGetter,suppressMenu: true,editable: false},
    { headerName: 'Vendor Name', field: 'vendorName', editable: false },
    {
      headerName: 'Classification',
      field: 'classificationName',
      editable: false,
    },
    { headerName: 'Currency', field: 'currencyName', editable: false },
    { headerName: 'Country', field: 'vendorCountryName', editable: false },
    {
      headerName: 'State/Province',
      field: 'vendorRegionName',
      editable: false,
    },
    { headerName: 'City', field: 'vendorAddressCity', editable: false },
    { headerName: 'Address', field: 'vendorAddressStreet', editable: false },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: StatusComponent,
      editable: false,
      suppressMenu: true,
    },
    {
      headerName: 'Action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        edit: (params: any) => {
          let dialogRef = this.dialog.open(
            EditVendorDetailsComponent,
            this.dialogConfig
          );
          let instance = dialogRef.componentInstance;
          instance.vendorDetails = params.data;
          instance.title = 'Edit Subsidiary Details';
          dialogRef.afterClosed().subscribe((res) => {
            if (res.data != null) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = res.data;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.vendorDetailsService
                .getSubsidaryDetails(this.vendorId)
                .subscribe((response: any) => {
                  if ((response.data != null) != null) {
                    this.subsidaryDetails = response.data;
                    this.grid2Api.setRowData(this.subsidaryDetails);
                  }
                });
            }
          });
        },
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              let input = { id: params.data.id };
              this.vendorDetailsService
                .deleteSubsidary(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    let dialogRef = this.dialog.open(
                      SuccessComponent,
                      this.dialogConfig
                    );
                    let message = response.data[0].message;
                    let instance = dialogRef.componentInstance;
                    instance.message = message;
                    this.vendorDetailsService
                      .getSubsidaryDetails(this.vendorId)
                      .subscribe((response: any) => {
                        if ((response.data != null) != null) {
                          this.subsidaryDetails = response.data;
                          this.grid2Api.setRowData(this.subsidaryDetails);
                        }
                      });
                  }
                });
            }
          });
        },
      },
      editable: false,
      suppressMenu: true,
    },
  ];

  openContactDetailsDialog() {
    let dialogRef = this.dialog.open(
      ContactDetailsComponent,
      this.dialogConfig
    );
    let data = { IsCreate: true };
    let instance = dialogRef.componentInstance;
    instance.contactInput = data;
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data != null) {
        this.vendorDetailsService
          .getContactDetails(this.vendorId)
          .subscribe((response: any) => {
            if ((response.data != null) != null) {
              this.contact_Detail = response.data;
              this.grid1Api.setRowData(this.ContactInfo);
            }
          });
      }
    });
  }

  openVendorDetailsDialog() {
    let dialogRef = this.dialog.open(
      EditVendorDetailsComponent,
      this.dialogConfig
    );
    let instance = dialogRef.componentInstance;
    instance.vendorDetails = this.vendorDetail;
    instance.title = 'Edit Vendor Details';
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data != null) {
        this.vendorDetailsService
          .getVendorDetails(this.vendorSAPId)
          .subscribe((response: any) => {
            if (response.data != null) this.vendorDetail = response.data[0];
          });
      }
    });
  }

  navigateToDashboard() {
    this.router.navigate(['']);
  }
}
