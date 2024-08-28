import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-create-invoice-header-master',
  templateUrl: './create-invoice-header-master.component.html',
  styleUrls: ['./create-invoice-header-master.component.css'],
  providers: [DatePipe],
})
export class CreateInvoiceHeaderMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Invoice Header Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  public id = 0;
  vendorInvoice_Date = new Date();
  postingdate = new Date();
  vendorNumber = '';
  vendorInvoiceNo = '';

  currencys = ['USD', 'INR', 'VND', 'EUR'];

  invoiceNo = '';
  currency = '';

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
        `${this.url}/api/InvoiceHeader/GetInvoiceHeaderMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Invoice Header Master Data';

            console.log(data);
            this.id = data.result.id;
            this.vendorInvoiceNo = data.result.vendorInvoiceNo;
            this.vendorNumber = data.result.vendorNumber;
            this.vendorInvoice_Date = data.result.vendorInvoiceDate;
            this.invoiceNo = data.result.invoiceNo;
            this.currency = data.result.currency;
            this.postingdate = data.result.postingdate;
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/InvoiceHeader/GetFilters`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result.listBu != null) {
            //this. buList=data.result.listBu;
          }
          this.showloader = false;
        }
      });
  }

  cancelMaster() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Invoice Header Master') },
    });
  }

  // /api/BoschOHMaster/UpdateBoschOHMaster"

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.vendorInvoiceNo == '' ||
      this.vendorNumber == '' ||
      this.invoiceNo == ''
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

      var url = this.url + '/api/InvoiceHeader/CreateInvoiceHeaderMaster';

      if (!this.isCreate) {
        url = this.url + '/api/InvoiceHeader/UpdateInvoiceHeaderMaster';
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
                routertitle: JSON.stringify('Invoice Header Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      // ID: this.guidanceCostID,
      id: this.id,
      vendorInvoiceNo: this.vendorInvoiceNo,
      vendorNumber: this.vendorNumber,
      vendorInvoiceDate: this.datePipe.transform(
        this.vendorInvoice_Date,
        'yyyy-MM-dd'
      ),
      invoiceNo: this.invoiceNo,
      currency: this.currency,
      postingdate: this.datePipe.transform(this.postingdate, 'yyyy-MM-dd'),
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
