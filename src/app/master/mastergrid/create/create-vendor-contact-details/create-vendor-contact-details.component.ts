import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-create-vendor-contact-details',
  templateUrl: './create-vendor-contact-details.component.html',
  styleUrls: ['./create-vendor-contact-details.component.css'],

  providers: [DatePipe],
})
export class CreateVendorContactDetailsComponent implements OnInit {
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
        `${this.url}/api/VendorMaster/GetVendorContactDetails/${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Vendor Contact Details Master Data';

            console.log(data);
            this.id = data.result.id;
            this.contactName = data.result.contactName;
            this.email = data.result.email;
            this.countryCode = data.result.countryCode;
            this.designation = data.result.designation;
            this.notes = data.result.notes;
            this.status = data.result.status;
            this.vendorID = data.result.vendorID;
            this.mobile = data.result.mobile;
          }
        });
    }
  }

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';
    if (
      this.contactName === '' ||
      this.email === '' ||
      this.countryCode === '' ||
      this.designation === '' ||
      this.notes === '' ||
      this.status === '' ||
      this.id === '' ||
      this.vendorID === '' ||
      this.mobile === ''
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

      var url = this.url + '/api/VendorMaster/CreateVendorContactDetails';

      if (!this.isCreate) {
        console.log('updated called');
        url = this.url + '/api/VendorMaster/UpdateVendorContactDetails';
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
                routertitle: JSON.stringify('Vendor Contact Details'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      contactName: this.contactName,
      email: this.email,
      countryCode: this.countryCode,
      designation: this.designation,
      notes: this.notes,
      status: this.status,

      id: this.id,
      vendorID: this.vendorID,
      mobile: this.mobile,
    };

    console.log('dates');
    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Vendor Contact Details') },
    });
  }

  public routerdata: any;

  title = 'Create Vendor Contact Details Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  contactName = '';
  email = '';
  countryCode = '';

  designation = '';
  notes = '';
  status = '';

  id = '';
  vendorID = '';
  mobile = '';
}
