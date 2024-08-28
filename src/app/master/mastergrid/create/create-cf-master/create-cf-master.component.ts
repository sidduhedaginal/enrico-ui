import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-cf-master',
  templateUrl: './create-cf-master.component.html',
  styleUrls: ['./create-cf-master.component.css'],
  providers: [DatePipe],
})
export class CreateCfMasterComponent implements OnInit {
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
        `${this.url}/api/CfMaster/GetCfMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update CF Master Data';
            console.log('data get element by id');

            console.log(data);
            this.id = data.result.id;
            this.name = data.result.name;
            this.companyCode = data.result.companyCode;
            this.source = data.result.source;
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
      this.name === '' ||
      this.companyCode === '' ||
      this.source === '' ||
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

      var url = this.url + '/api/CfMaster/CreateCfMaster';

      if (!this.isCreate) {
        url = this.url + '/api/CfMaster/UpdateCfMaster';
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
              queryParams: { routertitle: JSON.stringify('CF Master') },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      id: this.id,
      name: this.name,
      companyCode: this.companyCode,
      source: this.source,
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
      queryParams: { routertitle: JSON.stringify('CF Master') },
    });
  }

  public routerdata: any;
  title = 'Create CF Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  id = '';
  name = '';
  companyCode = '';

  source = '';
  isActive = '';
  createdDate = '';

  createdBy = '';
  updatedDate = '';
  updatedBy = '';
}
