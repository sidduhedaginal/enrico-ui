import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-create-company-master',
  templateUrl: './create-company-master.component.html',
  styleUrls: ['./create-company-master.component.css'],
  providers: [DatePipe],
})
export class CreateCompanyMasterComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  // completed

  public showloader = false;

  errorMessage = '';
  title = 'Create Company Master Data';
  isCreate = true;
  public routerdata: any;

  public companyCode = 0;
  public name1 = '';
  public name2 = '';
  public country = 'India';
  public city = '';
  public id = 0;
  public CountryList = [
    {
      name: 'India',
      value: 'India',
      currency: 'INR',
    },
    {
      name: 'US',
      value: 'US',
      currency: 'USD',
    },
    {
      name: 'Vietnam',
      value: 'Vietnam',
      currency: 'VND',
    },
  ];

  public street = '';
  public region = '';
  public postalCode = '';
  public currency = '';
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
    });

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/CompanyMaster/GetCompanyMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Company Master Data';
            this.companyCode = data.result.companyCode;
            this.name1 = data.result.name1;
            this.name2 = data.result.name2;
            this.country = data.result.country;
            this.street = data.result.street;
            this.currency = data.result.currency;
            this.region = data.result.region;
            this.postalCode = data.result.postalCode;
            this.city = data.result.city;
            this.id = data.result.id;
          }
        });
    }
  }

  onCountryChange() {
    for (let index = 0; index < this.CountryList.length; index++) {
      if (this.CountryList[index].name == this.country) {
        // this.location_mode=this.vendor_card[index].location;
        this.currency = this.CountryList[index].currency;
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  saveData() {
    // alert(this.street)

    this.showloader = true;

    if (
      this.companyCode <= 0 ||
      this.name1 == '' ||
      this.name2 == '' ||
      this.country == '' ||
      this.currency == '' ||
      this.street == '' ||
      this.region == '' ||
      this.city == '' ||
      this.postalCode == ''
    ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      this.showloader = false;

      return false;
    } else {
      var formdata = new FormData();
      formdata.append(
        'input',
        "{companyCode:'" +
          this.companyCode +
          "',id:'" +
          this.id +
          "',name1:'" +
          this.name1 +
          "',name2:'" +
          this.name2 +
          "',country:'" +
          this.country +
          "',currency:'" +
          this.currency +
          "',street:'" +
          this.street +
          "',region:'" +
          this.region +
          "',city:'" +
          this.city +
          "'," +
          "postalCode:'" +
          this.postalCode +
          "'}"
      );

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/CompanyMaster/CreateCompanyMaster';

      if (!this.isCreate) {
        url = this.url + '/api/CompanyMaster/UpdateCompanyMaster';
      }

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
              queryParams: { routertitle: JSON.stringify('Company Master') },
            });
          }
        });

      return true;
    }
  }

  cancelCompanyMaster() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Company Master') },
    });
  }
}
