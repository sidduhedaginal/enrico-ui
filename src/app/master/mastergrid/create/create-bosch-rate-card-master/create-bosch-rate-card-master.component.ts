import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-bosch-rate-card-master',
  templateUrl: './create-bosch-rate-card-master.component.html',
  styleUrls: ['./create-bosch-rate-card-master.component.css'],
  providers: [DatePipe],
})
export class CreateBoschRateCardMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Bosch Rate Card Master Data';

  public currency = 'INR';
  public company = '6520';
  public skillsetName = '';
  public rateCardId = '';

  public gradeId = 0;
  public grade0 = 0;
  public grade1 = 0;
  public grade2 = 0;
  public grade3 = 0;
  public grade4 = 0;
  public price = 0;

  public validityStartDate = new Date();
  public validityEndDate = new Date();

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  skillset_card: any = [];
  grade_list: any = [];
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
        `${this.url}/api/BoschRateCard/GetBoschRateCardById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Bosch Rate Card Master Data';

            console.log(data.result);
            this.currency = data.result.currency;
            this.company = data.result.companyCode;
            this.skillsetName = data.result.skillsetId;
            this.rateCardId = data.result.rateCardId;
            this.gradeId = data.result.grade;
            this.price = data.result.price;
            this.rateCardId = data.result.id;
            // this.grade2 = data.result.grade2;
            // this.grade3 = data.result.grade3;
            // this.grade4 = data.result.grade4;
            this.validityStartDate = new Date(data.result.validityStart);
            this.validityEndDate == new Date(data.result.validityEnd);
          }
        });
    }
  }

  onKeyDownforGraid(event: any) {
    // this.dataValue=this.params.value;
    if (
      event.keyCode === 8 ||
      event.keyCode === 46 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    ) {
      return true;
    }

    if (event.target.value === undefined) {
      return false;
    } else if (event.target.value.length >= 50) {
      event.preventDefault();

      return true;
    }
    if (event.key == '.') {
      if (event.target.value.includes('.')) {
        event.preventDefault();
      }
      return true;
    } else if (!isNumeric(event)) {
      //event.preventDefault();

      return false;
    } else if (event.target.value.includes('.') && event.key != '.') {
      let myarr = (event.target.value + event.key).split('.');
      if (myarr[1].length > 3) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

    function isNumeric(ev: any) {
      return /\d/.test(ev.key);
    }
    return true;
  }

  getFilters() {
    this.showloader = true;

    fetch(
      `${this.url}/api/VendorRateCardMaster/GetVendorRateCardFilter?CompanyCode=${this.company}&isCreate=${this.isCreate}`
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result.skillsetRecords != null) {
            this.skillset_card = data.result.skillsetRecords;
          }
          if (data.result.gradeMasterRecords != null) {
            this.grade_list = data.result.gradeMasterRecords;
          }
          this.showloader = false;
        }
      });
  }

  saveboschRateCard() {
    this.showloader = true;
    this.errorMessage = '';


    if (
      this.currency == '' ||
      this.company == '' ||
      this.skillsetName == '' ||
      this.validityStartDate == null ||
      this.validityEndDate == null ||
       this.gradeId <= 0
    ) {

      this.errorMessage = 'Please fill all mandatory (*) fields.';
      this.showloader = false;
       return false;
    }
    else if (this.validityStartDate >= this.validityEndDate) {
      this.errorMessage =
        'Valid end date should be greater than valid start date';
      this.showloader = false;
      return false;
    }
     else {
      var formdata = new FormData();

      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/BoschRateCard/CreateBoschRateCard';

      if (!this.isCreate) {
        console.log('updated called');
        url = this.url + '/api/BoschRateCard/UpdateBoschRateCard';
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
                routertitle: JSON.stringify('Bosch Rate Card Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      boschRateCardId: this.rateCardId,
      currency: this.currency,
      companyCode: this.company,
      skillsetId: this.skillsetName,
      //rateCardId: this.rateCardId,
      grade: this.gradeId,
      price: this.price,
      ValidityStart: this.datePipe.transform(
        this.validityStartDate,
        'yyyy-MM-dd'
      ),
      ValidityEnd: this.datePipe.transform(this.validityEndDate, 'yyyy-MM-dd'),
    };

    console.log('created objects');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
