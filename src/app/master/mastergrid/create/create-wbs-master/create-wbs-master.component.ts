import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-wbs-master',
  templateUrl: './create-wbs-master.component.html',
  styleUrls: ['./create-wbs-master.component.css'],
  providers: [DatePipe],
})

export class CreateWbsMasterComponent implements OnInit {
  
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  public routerdata: any;
  title = 'Create WBS Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  wbsElement = '';
  description = '';
  projectId = '';

  companyCode = '6520';
  technicallyCompleted = '';
  plant = '';
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

    if (this.routerdata.data > 0) {
      fetch(
        `${this.url}/api/Wbsmaster/GetWbsmasterMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update WBS Master Data';

            console.log(data);
            this.id = data.result.id;
            this.wbsElement = data.result.wbselement;
            this.description = data.result.description;
            this.projectId = data.result.projectId;

            this.companyCode = data.result.companyCode;
            this.plant = data.result.plant;
            this.technicallyCompleted = data.result.technicallyCompleted;

            // this._validFrom = new Date(data.result.validFrom);
            // this._validTo == new Date(data.result.validTo);
          }
        });
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/Wbsmaster/GetFilters`)
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
      queryParams: { routertitle: JSON.stringify('WBS Master') },
    });
  }

  // /api/BoschOHMaster/UpdateBoschOHMaster"

  saveMaster() {

    this.showloader = true;
    this.errorMessage = '';

    
    if (this.wbsElement == '' || this.description == '' ||  this.projectId == '' 
      || this.companyCode == '' ||  this.plant == '' || this.technicallyCompleted == '')
    {
 
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      return false;

    }
    else {

      //  const tmp =
            
      var formdata = new FormData();
      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };
      
      var url = this.url + '/api/Wbsmaster/CreateWbsmasterMaster';

      if (!this.isCreate) {
        url = this.url + '/api/Wbsmaster/UpdateWbsmasterMaster';
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

            console.log(data.message);
          } else {
            this.errorMessage = data.message;
            console.log(data.message);

            // alert(data.message);

            this.router.navigate(['/dashboard'], {
              queryParams: { routertitle: JSON.stringify('WBS Master') },
            });
          }
        });

      return true;
    }
  }

  getString(): string {

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
  
    var ids = 0;

    if (!this.isCreate) {
      ids = this.id;
    }

    const inputObject = {

      id: this.id,
      wbselement: this.wbsElement,
      description: this.description,

      projectId: this.projectId,
      companyCode: this.companyCode,
      plant: this.plant,

      technicallyCompleted: this.technicallyCompleted,
      source : "",
      isActive : true,

      createdBy : 0,
      CreatedDate : formattedDate



    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }


}
