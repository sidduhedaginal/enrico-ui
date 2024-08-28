import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-purchase-header-master',
  templateUrl: './create-purchase-header-master.component.html',
  styleUrls: ['./create-purchase-header-master.component.css'],
  providers: [DatePipe],
})
export class CreatePurchaseHeaderMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Purchase Header Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  ponumber = '';
  companyCode = '';
  purchasingDocumentType = '';

  documentDate = new Date();
  createdBy = '';
  lastItem = '';

  vendor = '';
  vendorName = '';
  validityStart = new Date();

  validityEnd = new Date();
  termsofPayment = '';
  paymentIn = '';

  purchasingOrganization = '';
  purchasingGroup = '';
  currency = '';

  exchangeRate = '';
  yourReference = '';
  requisitioner = '';

  email = '';
  incomplete = '';
  categoryofIncompleteness = '';
  id = 0;

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
        `${this.url}/api/PurchaseHeaderMaster/GetPurchaseHeaderMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Purchase Header Master Data';
            console.log('getElement By id data');
            console.log(data);

            this.ponumber = data.result.ponumber;
            this.companyCode = data.result.companyCode;
            this.purchasingDocumentType = data.result.purchasingDocumentType;
            this.documentDate = new Date(data.result.documentDate);
            this.createdBy = data.result.createdBy;
            this.lastItem = data.result.lastItem;
            this.vendor = data.result.vendor;
            this.vendorName = data.result.vendorName;
            this.validityStart = new Date(data.result.validityStart);
            this.validityEnd = new Date(data.result.validityEnd);
            this.termsofPayment = data.result.termsofPayment;
            this.paymentIn = data.result.paymentIn;
            this.purchasingOrganization = data.result.purchasingOrganization;
            this.purchasingGroup = data.result.purchasingGroup;
            this.currency = data.result.currency;
            this.exchangeRate = data.result.exchangeRate;
            this.yourReference = data.result.yourReference;
            this.requisitioner = data.result.requisitioner;
            this.email = data.result.email;
            this.incomplete = data.result.incomplete;
            this.categoryofIncompleteness =
              data.result.categoryofIncompleteness;
            this.id = data.result.id;
          }
        });
    }
  }

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (false) {
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

      var url =
        this.url + '/api/PurchaseHeaderMaster/CreatePurchaseHeaderMaster';

      if (!this.isCreate) {
        console.log('updated called');
        url = this.url + '/api/PurchaseHeaderMaster/UpdatePurchaseHeaderMaster';
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
              queryParams: {
                routertitle: JSON.stringify('Purchase Header Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      id: this.id,
      ponumber: this.ponumber,
      companyCode: this.companyCode,
      purchasingDocumentType: this.purchasingDocumentType,

      documentDate: this.datePipe.transform(this.documentDate, 'yyyy-MM-dd'),
      createdBy: this.createdBy,
      lastItem: this.lastItem,

      vendor: this.vendor,
      vendorName: this.vendorName,
      validityStart: this.datePipe.transform(this.validityStart, 'yyyy-MM-dd'),

      validityEnd: this.datePipe.transform(this.validityEnd, 'yyyy-MM-dd'),
      termsofPayment: this.termsofPayment,
      paymentIn: this.paymentIn,

      purchasingOrganization: this.purchasingOrganization,
      purchasingGroup: this.purchasingGroup,
      currency: this.currency,

      exchangeRate: this.exchangeRate,
      yourReference: this.yourReference,
      requisitioner: this.requisitioner,

      email: this.email,
      incomplete: this.incomplete,
      categoryofIncompleteness: this.categoryofIncompleteness,
      isActive: true,
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Purchase Header Master') },
    });
  }
}
