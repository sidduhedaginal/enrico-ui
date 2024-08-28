import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-funds-center-master',
  templateUrl: './create-funds-center-master.component.html',
  styleUrls: ['./create-funds-center-master.component.css'],
  providers: [DatePipe],
})
export class CreateFundsCenterMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Funds Center Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  public fmArea = '';
  public id = 0;
  public fundCenter = '';
  public fundCenterName = '';
  public description = '';

  public _validFrom = new Date();
  public _validTo = new Date();

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
        `${this.url}/api/FundsCenterMaster/GetFundsCenterMasterMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Funds Center Master Data';

            console.log(data);
            this.id = data.result.id;
            this.fmArea = data.result.fmarea;
            this.fundCenter = data.result.fundCenter;
            this.fundCenterName = data.result.fundCenterName;
            this.description = data.result.description;

            this._validFrom = new Date(data.result.validFrom);
            this._validTo == new Date(data.result.validTo);
            console.log(this._validTo);
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/FundsCenterMaster/GetFilters`)
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
      queryParams: { routertitle: JSON.stringify('Funds Center Master') },
    });
  }

  // /api/BoschOHMaster/UpdateBoschOHMaster"

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (this.fmArea == '') {
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
        this.url + '/api/FundsCenterMaster/CreateFundsCenterMasterMaster';

      if (!this.isCreate) {
        url = this.url + '/api/FundsCenterMaster/UpdateFundsCenterMasterMaster';
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
                routertitle: JSON.stringify('Funds Center Master'),
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
      fmArea: this.fmArea,
      fundCenter: this.fundCenter,
      fundCenterName: this.fundCenterName,
      description: this.description,
      validTo: this.datePipe.transform(this._validTo, 'yyyy-MM-dd'),
      validFrom: this.datePipe.transform(this._validFrom, 'yyyy-MM-dd'),

      // ID: this.guidanceCostID,
      //  id:this.id,
      //    vendorInvoiceNo : this.vendorInvoiceNo,
      //    vendorNumber : this.vendorNumber,
      //   vendorInvoiceDate : this.datePipe.transform(this.vendorInvoice_Date, 'yyyy-MM-dd'),
      //   invoiceNo:this.invoiceNo,
      //   currency:this.currency,
      //   postingdate:this.datePipe.transform(this.postingdate, 'yyyy-MM-dd'),
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
