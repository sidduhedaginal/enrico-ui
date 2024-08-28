import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-employee-master',
  templateUrl: './create-employee-master.component.html',
  styleUrls: ['./create-employee-master.component.css'],
  providers: [DatePipe],
})
export class CreateEmployeeMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // this.getFilters();

    this.activatedRoute.queryParams.subscribe((params) => {
      // { orderby: "price" }
      this.routerdata = params;
      // price
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    console.log(this.routerdata.data);
    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/EmployeeMaster/GetEmployeeMasterMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Employee Master Data';

            console.log(data);
            this.id = data.result.id;
            this.enum = data.result.enum;
            this.name = data.result.name;
            this.groupCode = data.result.groupCode;
            this.dept = data.result.dept;
            this.email = data.result.email;
            this.joinDate = data.result.joinDate;
            this.domainID = data.result.domainId;
            this.employeeLocation = data.result.employeeLocation;
            this.employeeCatGroup = data.result.employeeCatGroup;
            this.employeeCatSubGroup = data.result.employeeCatSubGroup;
            this.employeeStatus = data.result.employeeStatus;
            this.costCentre = data.result.costCentre;
            this.employeeSubLocationCode = data.result.employeeSubLocationCode;
            this.gid = data.result.gid;
            this.firstName = data.result.firstName;
            this.lastName = data.result.lastName;
            this.communicationFirstName = data.result.communicationFirstName;
            this.communicationLastName = data.result.communicationLastName;
            this.hRBPGID = data.result.hrbpgid;
            this.businessArea = data.result.businessArea;
            this.companyCode = data.result.companyCode;
            this.isActive = data.result.isActive;
            this.createdDate = data.result.createdDate;
            this.createdBy = data.result.createdBy;
            this.updatedDate = data.result.updatedDate;
            this.updatedBy = data.result.updatedBy;
          }
        });
    }
  }

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.id === '' ||
      this.enum === '' ||
      this.name === '' ||
      this.groupCode === '' ||
      this.dept === '' ||
      this.email === '' ||
      this.joinDate === '' ||
      this.domainID === '' ||
      this.employeeLocation === '' ||
      this.employeeCatGroup === '' ||
      this.employeeCatSubGroup === '' ||
      this.employeeStatus === '' ||
      this.costCentre === '' ||
      this.employeeSubLocationCode === '' ||
      this.gid === '' ||
      this.firstName === '' ||
      this.lastName === '' ||
      this.communicationFirstName === '' ||
      this.communicationLastName === '' ||
      this.hRBPGID === '' ||
      this.businessArea === '' ||
      this.companyCode === '' ||
      this.isActive === '' ||
      this.createdDate === '' ||
      this.createdBy === '' ||
      this.updatedDate === '' ||
      this.updatedBy === ''
    ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      return false;
    } else {
      //  const tmp =

      var formdata = new FormData();

      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/EmployeeMaster/CreateEmployeeMasterMaster';

      if (!this.isCreate) {
        console.log('updated called');
        url = this.url + '/api/EmployeeMaster/UpdateEmployeeMasterMaster';
      }

      console.log(url);
      fetch(url, requestOptions)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          this.showloader = false;

          if (data.success == false) {
            this.errorMessage = data.message;

            console.log(data.message);
          } else {
            this.errorMessage = data.message;
            console.log(data.message);

            // alert(data.message);

            this.router.navigate(['/dashboard'], {
              queryParams: { routertitle: JSON.stringify('Employee Master') },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      id: this.id,
      enum: this.enum,
      name: this.name,

      groupCode: this.groupCode,
      dept: this.dept,
      email: this.email,

      joinDate: this.joinDate,
      domainID: this.domainID,
      employeeLocation: this.employeeLocation,

      employeeCatGroup: this.employeeCatGroup,
      employeeCatSubGroup: this.employeeCatSubGroup,
      employeeStatus: this.employeeStatus,

      costCentre: this.costCentre,
      employeeSubLocationCode: this.employeeSubLocationCode,
      gid: this.gid,

      firstName: this.firstName,
      lastName: this.lastName,
      communicationFirstName: this.communicationFirstName,

      communicationLastName: this.communicationLastName,
      hRBPGID: this.hRBPGID,
      businessArea: this.businessArea,

      companyCode: this.companyCode,
      isActive: this.isActive,
      createdDate: this.createdDate,

      createdBy: this.createdBy,
      updatedDate: this.updatedDate,
      updatedBy: this.updatedBy,
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Employee Master') },
    });
  }

  public routerdata: any;
  title = 'Create Employee Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  id = '';
  enum = '';
  name = '';

  groupCode = '';
  dept = '';
  email = '';

  joinDate = '';
  domainID = '';
  employeeLocation = '';

  employeeCatGroup = '';
  employeeCatSubGroup = '';
  employeeStatus = '';

  costCentre = '';
  employeeSubLocationCode = '';
  gid = '';

  firstName = '';
  lastName = '';
  communicationFirstName = '';

  communicationLastName = '';
  hRBPGID = '';
  businessArea = '';

  companyCode = '';
  isActive = '';
  createdDate = '';

  createdBy = '';
  updatedDate = '';
  updatedBy = '';
}
