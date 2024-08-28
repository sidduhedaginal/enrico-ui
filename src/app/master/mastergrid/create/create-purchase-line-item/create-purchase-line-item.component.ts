import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-purchase-line-item',
  templateUrl: './create-purchase-line-item.component.html',
  styleUrls: ['./create-purchase-line-item.component.css'],
  providers: [DatePipe],
})
export class CreatePurchaseLineItemComponent implements OnInit {
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

            console.log(data);
            //   this.id=data.result.id;
            //  this.fmArea = data.result.fmarea;
            //  this.fundCenter = data.result.fundCenter;
            // this.fundCenterName=data.result.fundCenterName;
            // this.description=data.result.description;

            // this._validFrom = new Date(data.result.validFrom);
            // this._validTo == new Date(data.result.validTo);
            // console.log(this._validTo);
          }
        });
    }
  }

  public routerdata: any;
  title = 'Create Vendor Contact Details Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;
}
