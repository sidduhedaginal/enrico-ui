import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-grade-master',
  templateUrl: './create-grade-master.component.html',
  styleUrls: ['./create-grade-master.component.css'],
  providers: [DatePipe],
})
export class CreateGradeMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Grade Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  id = 0;
  companyCode = '';
  name = '';
  status = '';

  listStatus = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];
  listCompany: any = [];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    this.getFilters();

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/GradeMaster/GetGradeMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log('data received');
          console.log(data);

          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Grade Master Data';
            console.log(data);
            this.id = data.result.gradeMasterId;
            this.name = data.result.name;
            this.companyCode = data.result.companyCode;
            this.status = data.result.isActive;
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/GradeMaster/GetCompanyList`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result != null) {
            this.listCompany = data.result;
          }
          this.showloader = false;
        }
      });
  }

  saveDate() {
    this.showloader = true;
    this.errorMessage = '';

    if (this.companyCode == '' || this.name == '') {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      return false;
    } else {
      var formdata = new FormData();

      console.log(this.getString());
      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/GradeMaster/CreateGradeMaster';

      if (!this.isCreate) {
        url = this.url + '/api/GradeMaster/UpdateGradeMaster';
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
              queryParams: { routertitle: JSON.stringify('Grade Master') },
            });
          }
        });

      return true;
    }
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Grade Master') },
    });
  }
  getString(): string {
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    var ids = 0;
    if (!this.isCreate) {
      ids = this.id;
    }

    const inputObject = {
      gradeMasterId: ids,
      name: this.name,
      companyCode: this.companyCode,
      isActive: this.status,
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
