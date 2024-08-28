import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'lib-create-gb-business-area-master',
  templateUrl: './create-gb-business-area-master.component.html',
  styleUrls: ['./create-gb-business-area-master.component.css'],
  providers: [DatePipe],
})
export class CreateGbBusinessAreaMasterComponent implements OnInit {

  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {}



  title = 'Create GB Business Area Master Data';

  public routerdata: any;

  public gbCode = "";
  public description = "";
  public businessSector = "";


  public showloader = false;
  public errorMessage = "";
  public isCreate = true;

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      this.routerdata = params;
      console.log(this.routerdata); // price
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    // this.getFilters();

    if (this.routerdata.data !=null) {
      fetch(
        `${this.url}/api/GbMaster/GetGbMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;

          console.log("received data");
          console.log(data);

          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {

            this.title = 'Update  GB Business Area Master Data';

            this.gbCode = data.result.id;
            this.description = data.result.description;
            this.businessSector = data.result.businessSector;

          }
        });
    }
  }

  cancel(){

    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('GB Business Area Master') },
    });

  }
  saveGbBusiness() {


    this.showloader = true;
    this.errorMessage = '';
    if (

      this.gbCode == '' ||
      this.description == '' ||
      this.businessSector == ''
    ) {

      this.errorMessage = 'Please fill all mandatory (*) fields.';
      return false;

    } else {


      var formdata = new FormData();

      formdata.append(

        "input",
        this.getString()

      );

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/GbMaster/CreateGbMaster';

      if (!this.isCreate) {

        console.log("updated called");
        url = this.url + '/api/GbMaster/UpdateGbMaster';

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
              queryParams: { routertitle: JSON.stringify('GB Business Area Master') },
            });


          }
        });

      return true;
    }
  }


  getString(): string {
    const inputObject = {

      id: this.gbCode,
      description: this.description,
      businessSector: this.businessSector

    };

      console.log("created objects");

      const serializedString = JSON.stringify(inputObject);
      console.log(serializedString);
      return serializedString;

  };

}
