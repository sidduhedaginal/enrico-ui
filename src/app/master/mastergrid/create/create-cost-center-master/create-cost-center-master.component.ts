import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-create-cost-center-master',
  templateUrl: './create-cost-center-master.component.html',
  styleUrls: ['./create-cost-center-master.component.css'],
  providers: [DatePipe],
})
export class CreateCostCenterMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create Cost Center Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  public controllingArea = '';
  public costCenter = '';
  public costCenterName = '';
  public id = 0;
  public description = '';
  businessArea = '';
  companyCode = '';
  department = '';
  public validityStart = new Date();

  public validityEnd = new Date();

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

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/CostCenterMaster/GetCostCenterMasterMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Cost Center Master Data';

            this.id = data.result.id;
            this.controllingArea = data.result.controllingArea;
            this.costCenter = data.result.costCenter;
            this.costCenterName = data.result.costCenterName;
            this.description = data.result.description;
            this.businessArea = data.result.businessArea;
            this.companyCode = data.result.companyCode;
            this.department = data.result.department;

            this.validityStart = new Date(data.result.validFrom);
            this.validityEnd == new Date(data.result.ValidTo);
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/CostCenterMaster/GetFilters`)
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
      queryParams: { routertitle: JSON.stringify('Cost Center Master') },
    });
  }

  // /api/BoschOHMaster/UpdateBoschOHMaster"

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.controllingArea == '' ||
      this.costCenter == '' ||
      this.costCenterName == ''
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

      var url = this.url + '/api/CostCenterMaster/CreateCostCenterMasterMaster';

      if (!this.isCreate) {
        url = this.url + '/api/CostCenterMaster/UpdateCostCenterMasterMaster';
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
                routertitle: JSON.stringify('Cost Center Master'),
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
      controllingArea: this.controllingArea,
      costCenter: this.costCenter,
      costCenterName: this.costCenterName,
      description: this.description,
      businessArea: this.businessArea,
      companyCode: this.companyCode,
      department: this.department,

      validFrom: this.datePipe.transform(this.validityStart, 'yyyy-MM-dd'),
      validTo: this.datePipe.transform(this.validityEnd, 'yyyy-MM-dd'),
    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }
}
