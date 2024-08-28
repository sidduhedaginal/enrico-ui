import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-cfcycle-master',
  templateUrl: './create-cfcycle-master.component.html',
  styleUrls: ['./create-cfcycle-master.component.css'],
  providers: [DatePipe],
})
export class CreateCFCycleMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public validity_startDate = new Date();
  public validity_endDate = new Date();

  title = 'Create CF Cycle Master Data';
  public routerdata: any;

  public planningCycle = '';
  public planningCycleName = '';

  public id = 0;
  public company = '6520';
  public planningYear = '';
  public startingMonth = '';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  public cfCycleMaster: any = [];
  public months = [
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

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      this.routerdata = params;
      console.log(this.routerdata); // price
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    this.getFilters();

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/CfcycleMaster/GetCfcycleMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log('received data');
          console.log(data);
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update CF Cycle Master Data';

            this.id = data.result.id;

            this.planningCycle = data.result.cfMasterId;
            this.company = data.result.companyCode;
            this.planningYear = data.result.planningYear;
            this.startingMonth = data.result.startingMonth;
            this.validity_startDate = new Date(data.result.startDate);
            this.validity_endDate == new Date(data.result.endDate);
            this.planningCycleName = data.result.planningCycle;
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/CfcycleMaster/GetFilters`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result.listCfMaster != null) {
            this.cfCycleMaster = data.result.listCfMaster;
          }
          this.showloader = false;
        }
      });
  }

  saveCfCycle() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.planningCycle == '' ||
      this.company == '' ||
      this.planningYear == '' ||
      this.startingMonth == ''
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

      var url = this.url + '/api/CfcycleMaster/CreateCfcycleMaster';

      if (!this.isCreate) {
        console.log('updated called');
        url = this.url + '/api/CfcycleMaster/UpdateCfcycleMaster';
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
            // alert(data.message);

            this.router.navigate(['/dashboard'], {
              queryParams: { routertitle: JSON.stringify('CF Cycle Master') },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      id: this.id,
      cfMasterId: this.planningCycle,
      planningCycle: this.planningCycleName,
      companyCode: this.company,
      planningYear: this.planningYear,
      startingMonth: this.startingMonth,
      startDate: this.datePipe.transform(this.validity_startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.validity_endDate, 'yyyy-MM-dd'),
    };

    console.log('created objects');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
