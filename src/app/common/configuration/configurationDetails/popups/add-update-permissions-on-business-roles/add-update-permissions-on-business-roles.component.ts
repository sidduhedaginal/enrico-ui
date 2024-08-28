import { Component, EventEmitter, OnInit, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonApiServiceService } from '../../../../common-api-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../../../services/loader.service';

@Component({
  selector: 'app-add-update-permissions-on-business-roles',
  templateUrl: './add-update-permissions-on-business-roles.component.html',
  styleUrls: ['./add-update-permissions-on-business-roles.component.css'],
})
export class AddUpdatePermissionsOnBusinessRolesComponent implements OnInit {
  ngOnInit(): void {
    this.receivedData = this.data;

    if (this.receivedData.operation == 'update') {
      this.updatePermissions(this.receivedData);
    } else if (this.receivedData.operation == 'create') {
      this.createPermission(this.receivedData);
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdatePermissionsOnBusinessRolesComponent>,
    private commonApiService: CommonApiServiceService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      roleId: [
        { value: '', disabled: data.operation == 'update' },
        Validators.required,
      ],
      featureId: [
        { value: '', disabled: data.operation == 'update' },
        Validators.required,
      ],
    });

    Object.keys(this.rolesMapping).forEach((permission) => {
      this.myForm.addControl(
        permission,
        this.formBuilder.control('false', Validators.required)
      );
    });
  }

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  myForm: FormGroup;
  showLoading: boolean = false;
  receivedData: any;
  featuresList: any;
  businessRoles: any;
  errorMsg = '';

  rolesMapping: Record<string, number> = {
    CreatePermission: 0,
    ReadPermission: 1,
    EditPermission: 2,
    DeletePermission: 3,
    ApprovePermission: 4,
    RejectPermission: 5,
    DelegatePermission: 6,
    WithdrawPermission: 7,
    ImportPermission: 8,
    ExportPermission: 9,
    SendBackPermission: 10,
    OwnershipChangePermission: 11,
  };

  permissionWithOrder: any = [
    {
      key: 'ReadPermission',
      value: 1,
    },
    {
      key: 'ExportPermission',
      value: 9,
    },
    {
      key: 'CreatePermission',
      value: 0,
    },
    {
      key: 'ApprovePermission',
      value: 4,
    },
    {
      key: 'EditPermission',
      value: 2,
    },
    {
      key: 'RejectPermission',
      value: 5,
    },
    {
      key: 'DeletePermission',
      value: 3,
    },
    {
      key: 'DelegatePermission',
      value: 6,
    },
    {
      key: 'ImportPermission',
      value: 8,
    },
    {
      key: 'WithdrawPermission',
      value: 7,
    },
    {
      key: 'SendBackPermission',
      value: 10,
    },
    {
      key: 'OwnershipChangePermission',
      value: 11,
    },
  ];

  updatePermissions(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService
      .getFeaturesAndBusinessForPermissionsOnBusinessRoles(data?.entityId)
      .subscribe({
        next: (response: any) => {
          this.featuresList = response.data?.features;
          this.businessRoles = response.data?.businessRoles;
          if (this.myForm && this.receivedData?.payload?.roleId !== undefined) {
            this.myForm
              .get('roleId')
              ?.setValue(this.receivedData.payload.roleId);
          }
          if (this.myForm && this.receivedData?.payload?.roleId !== undefined) {
            this.myForm
              .get('featureId')
              ?.setValue([this.receivedData.payload.featureId]);
          }

          if (this.myForm && this.receivedData?.payload?.permissions !== null) {
            for (const permissions of this.receivedData?.payload?.permissions) {
              this.myForm.get(permissions?.permissionName)?.setValue('true');
            }
          }
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

  createPermission(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService
      .getFeaturesAndBusinessForPermissionsOnBusinessRoles(data?.entityId)
      .subscribe({
        next: (response: any) => {
          this.featuresList = response.data?.features;
          this.businessRoles = response.data?.businessRoles;
        },
        error: (e: any) => {
          console.log(e);
          // this.showSnackbar(e);
          this.errorMsg = e;
          this.loaderService.setDisableLoading();
        },
        complete: () => {
          this.loaderService.setDisableLoading();
        },
      });
  }

  onRadioChange(event: any, permissionField: any) {
    if (permissionField !== 'ReadPermission') {
      if (event.value == 'true')
        this.myForm.get('ReadPermission')?.setValue('true');
    }
    if (permissionField == 'ReadPermission') {
      if (event.value == 'false'){
        this.myForm.get('EditPermission')?.setValue('false');
        this.myForm.get('CreatePermission')?.setValue('false');
        this.myForm.get('DeletePermission')?.setValue('false');
        this.myForm.get('ApprovePermission')?.setValue('false');
        this.myForm.get('RejectPermission')?.setValue('false');
        this.myForm.get('DelegatePermission')?.setValue('false');
        this.myForm.get('WithdrawPermission')?.setValue('false');
        this.myForm.get('ImportPermission')?.setValue('false');
        this.myForm.get('ExportPermission')?.setValue('false');
        this.myForm.get('SendBackPermission')?.setValue('false');
        this.myForm.get('OwnershipChangePermission')?.setValue('false');
      }
    }
  }

  onSubmit() {
    let formData = this.myForm.getRawValue();
    let permissionIds: any = [];
    for (const item in formData) {
      if (this.rolesMapping.hasOwnProperty(item) && formData[item] == 'true') {
        permissionIds.push(this.rolesMapping[item]);
        delete formData[item];
      }
    }

    if (this.receivedData.operation == 'update') {
      formData.features = [
        { featuresId: formData.featureId[0], permissionIds: permissionIds },
      ];
      this.addOrUpdatePermissionsOnBusinessRoles(formData);
    } else if (this.receivedData.operation == 'create') {
      const newFeatures = [];
      for (const ids of formData.featureId) {
        newFeatures.push({ featuresId: ids, permissionIds: permissionIds });
      }
      formData.features = newFeatures;
      this.addOrUpdatePermissionsOnBusinessRoles(formData);
    }
    // delete
    else {
      let formDataForDelete = {
        roleId: this.receivedData.payload.roleId,
        features: {},
      };
      formDataForDelete['features'] = [
        { featuresId: this.receivedData.payload.featureId, permissionIds: [] },
      ];
      this.addOrUpdatePermissionsOnBusinessRoles(formDataForDelete);
    }
  }

  addOrUpdatePermissionsOnBusinessRoles(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService
      .addOrUpdatePermissionsOnBusinessRoles(data)
      .subscribe({
        next: (response: any) => {
          // uncoment this
          this.isFromSubmitted.emit(true);
          this.dialogRef.close();
        },
        error: (e: any) => {
          this.errorMsg = e;
          console.log(e);
          this.loaderService.setDisableLoading();
          // this.showSnackbar(e);
        },
        complete: () => {
          this.loaderService.setDisableLoading();
          this.showSnackbar(
            'Successfully completed   ' + this.receivedData.operation
          );
        },
      });
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
