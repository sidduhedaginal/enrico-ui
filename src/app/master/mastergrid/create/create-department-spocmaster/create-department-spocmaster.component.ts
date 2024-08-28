import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-department-spocmaster',
  templateUrl: './create-department-spocmaster.component.html',
  styleUrls: ['./create-department-spocmaster.component.css'],
  providers: [DatePipe],
})
export class CreateDepartmentSPOCMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  title = 'Create Department SPOC  Master Data';
  public routerdata: any;

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  public departmentName = '';
  public spocName = '';
  public spocMail = '';

  public validity_startDate = new Date();
  public validity_endDate = new Date();

  public id = 0;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      this.routerdata = params;
      console.log(this.routerdata); // price
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    // this.getFilters();

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/DepartmentSpocMaster/GetDepartmentSpocmasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;

          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Department SPOC Master Data';

            this.id = data.result.id;
            this.departmentName = data.result.departmentName;
            this.spocName = data.result.spocname;
            this.spocMail = data.result.spocemail;
            this.validity_startDate = new Date(data.result.validityStart);
            this.validity_endDate == new Date(data.result.validityEnd);
          }
        });
    }
  }

  cancelDepartmentSpocMaster() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Department SPOC Master') },
    });
  }
  saveDepartmentSpocMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.departmentName == '' ||
      this.spocName == '' ||
      this.spocMail == ''
    ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      return false;
    } else {
      var formdata = new FormData();

      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url =
        this.url + '/api/DepartmentSpocMaster/CreateDepartmentSpocmaster';

      if (!this.isCreate) {
        url = this.url + '/api/DepartmentSpocMaster/UpdateDepartmentSpocmaster';
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
          } else {
            // alert(data.message);

            this.router.navigate(['/dashboard'], {
              queryParams: {
                routertitle: JSON.stringify('Department SPOC Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString() {
    const inputObject = {
      id: this.id,
      departmentName: this.departmentName,
      spocname: this.spocName,
      spocemail: this.spocMail,
      validityStart: this.datePipe.transform(
        this.validity_startDate,
        'yyyy-MM-dd'
      ),
      validityEnd: this.datePipe.transform(this.validity_endDate, 'yyyy-MM-dd'),
    };

    console.log('created objects');
    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
