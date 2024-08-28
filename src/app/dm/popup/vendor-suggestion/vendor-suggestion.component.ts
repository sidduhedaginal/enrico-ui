import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';
import { sowjdService } from '../../services/sowjdService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { LoaderService } from 'src/app/services/loader.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'lib-vendor-suggestion',
  templateUrl: './vendor-suggestion.component.html',
  styleUrls: ['./vendor-suggestion.component.scss'],
})
export class VendorSuggestionComponent implements OnInit {
  VendorSuggestionsMAsterDetail: any = [];
  sowJdId: any;
  formValues: any;
  rowData__Po__vendor = [];
  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    flex: 1,
    editable: true,
    menuTabs: ['filterMenuTab'],
  };
  public getRowStyle(param: any) {
    if (param.node.rowIndex % 2 != 0) {
      return { class: 'gridbackground' };
    } else {
      return { class: 'whiteback' };
    }
  }
  public style: any = {
    width: '100%',
    height: '100%',
    flex: '1',
    'margin-top': '5px',
    display: 'flex',
    'overflow-y': 'auto',
    'overflow-x': 'hidden',
  };
  private gridApi__Po__vendor!: GridApi;
  myForm!: FormGroup;
  viewgrid: boolean;
  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    public dialogRef: MatDialogRef<VendorSuggestionComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private loaderService: LoaderService
  ) {
    this.sowJdId = this.data.sowJdId;
    this.viewgrid = this.data.viewgrid;
  }

  createVenderSuggestion() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) return;

    const VendorDetail: any = {
      ...this.myForm.value,
    };
    VendorDetail['sowJdId'] = this.sowJdId;
    this.dialogRef.close({
      VendorDetail: VendorDetail,
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.myForm = this.makeForm();
    if (this.formValues) {
      this.setFormData();
    }
  }

  changedEventValue(vendor: MatAutocompleteSelectedEvent) {
    this.myForm.get('vendorId')?.setValue(vendor['vendorId']);
  }

  makeForm() {
    return this._formBuilder.group({
      vendorId: ['', Validators.required],
      remarks: ['', Validators.required],
      suggestion: [''],
    });
  }

  setFormData() {
    if (this.formValues) {
      this.myForm.get('vendorId')?.setValue(this.formValues?.vendorId);
      this.myForm.get('remarks')?.setValue(this.formValues?.remarks);
      this.myForm.get('suggestion')?.setValue(null);
    }
  }
}
