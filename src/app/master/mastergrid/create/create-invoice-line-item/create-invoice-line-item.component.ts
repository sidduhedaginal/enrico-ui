import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-create-invoice-line-item',
  templateUrl: './create-invoice-line-item.component.html',
  styleUrls: ['./create-invoice-line-item.component.css'],
  providers: [DatePipe],
})
export class CreateInvoiceLineItemComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Invoice Line Item Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  id = 0;

  poNumber = '';
  item = '';
  debitCreditIndicator = '';
  fcInvoiceValue = '';
  lcInvoiceValue = '';
  debiCrediIndicator = '';
  ponumber = '';
  vendorInvoice_Date = new Date();
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
        `${this.url}/api/InvoiceLineItem/GetInvoiceLineItemMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Invoice Line Iteam Data';

            this.debiCrediIndicator = data.result.debiCrediIndicator;
            this.fcInvoiceValue = data.result.fcInvoiceValue;
            this.item = data.result.item;
            this.lcInvoiceValue = data.result.lcInvoiceValue;
            this.ponumber = data.result.ponumber;
            this.vendorInvoice_Date = data.result.vendorInvoiceDate;
            this.id = data.result.id;
            //  this.vendorInvoiceNo = data.result.vendorInvoiceNo;
            //  this.vendorNumber = data.result.vendorNumber;
            // this.vendorInvoice_Date=data.result.vendorInvoiceDate;
            // this.invoiceNo=data.result.invoiceNo;
            // this.currency=data.result.currency;
            // this.postingdate=data.result.postingdate;
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/InvoiceLineItem/GetFilters`)
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
      queryParams: { routertitle: JSON.stringify('Invoice Line Item Master') },
    });
  }

  // /api/BoschOHMaster/UpdateBoschOHMaster"

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (this.debiCrediIndicator == '') {
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

      var url = this.url + '/api/InvoiceLineItem/CreateInvoiceLineItemMaster';

      if (!this.isCreate) {
        url = this.url + '/api/InvoiceLineItem/UpdateInvoiceLineItemMaster';
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
                routertitle: JSON.stringify('Invoice Line Item Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      debiCrediIndicator: this.debiCrediIndicator,
      fcInvoiceValue: this.fcInvoiceValue,
      item: this.item,
      lcInvoiceValue: this.lcInvoiceValue,
      ponumber: this.ponumber,
      id: this.id,
      vendorInvoiceDate: this.datePipe.transform(
        this.vendorInvoice_Date,
        'yyyy-MM-dd'
      ),
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
