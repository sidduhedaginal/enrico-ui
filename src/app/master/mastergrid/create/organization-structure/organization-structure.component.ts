import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'lib-organization-structure',
  templateUrl: './organization-structure.component.html',
  styleUrls: ['./organization-structure.component.css'],
  providers: [DatePipe],
})
export class OrganizationStructureComponent implements OnInit {
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
        `${this.url}/api/OrgStructureMaster/GetOrgStructureMasterMasterById?id=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {
            this.title = 'Update Organization Structure Data';

            console.log(data);

            this.id = data.result.id;
            this.buName = data.result.buName;
            this.buid = data.result.buid;
            this.buHeadENo = data.result.buheadEno;
            this.buHeadName = data.result.buheadName;
            this.buHeadEmail = data.result.buheadEmail;

            this.sectionName = data.result.sectionName;
            this.sectionID = data.result.sectionId;
            this.sectionHeadENo = data.result.sectionHeadEno;

            this.sectionHeadName = data.result.sectionHeadName;
            this.sectionHeadEmail = data.result.sectionHeadEmail;
            this.departmentName = data.result.departmentName;
            this.departmentID = data.result.departmentId;
            this.departmentHeadENo = data.result.departmentHeadEno;
            this.departmentHeadName = data.result.departmentHeadName;
            this.departmentHeadEmail = data.result.departmentHeadEmail;

            this.groupName = data.result.groupName;
            this.groupId = data.result.groupId;
            this.groupManagerENo = data.result.groupManagerEno;
            this.groupManagerName = data.result.groupManagerName;
            this.groupManagerEmail = data.result.groupManagerEmail;
            this.source = data.result.source;
            this.isActive = data.result.isActive;
            this.createdDate =  new Date(data.result.createdDate);
            this.createdBy = data.result.createdBy;
            this.updatedDate = new Date(data.result.updatedDate);
            this.updatedBy = data.result.updatedBy;
            
          }
        });
    }
  }

  saveMaster() {
    this.showloader = true;
    this.errorMessage = '';

    if (
      // this.id === '' ||
      this.buName === '' ||
      this.buid === '' ||
      // this.buHeadENo === '' ||
      this.buHeadName === '' ||
      this.buHeadEmail === '' ||
      this.sectionName === '' ||
      
      this.sectionID === '' ||
      // this.sectionHeadENo === '' ||
      
      this.sectionHeadName === '' ||
      this.sectionHeadEmail === ''

      // this.departmentName === '' ||
      // this.departmentID === '' ||
      // this.departmentHeadENo === '' ||
      // this.departmentHeadName === '' ||
      // this.departmentHeadEmail === '' ||
      // this.groupName === '' ||
      // this.groupId === '' ||
      // this.groupManagerENo === '' ||
      // this.groupManagerName === '' ||
      // this.groupManagerEmail === '' ||
      // this.source === '' ||
      // this.isActive === '' ||
      // this.createdDate === '' ||
      // this.createdBy === '' ||
      // this.updatedDate === '' ||
      // this.updatedBy === ''
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

      var url =
        this.url + '/api/OrgStructureMaster/CreateOrgStructureMasterMaster';

      if (!this.isCreate) {
        console.log('updated called');
        url =
          this.url + '/api/OrgStructureMaster/UpdateOrgStructureMasterMaster';
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
                routertitle: JSON.stringify('Organization Structure'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    
    var ids = '0';


    if (!this.isCreate) {
      ids = this.id;
    }

    const inputObject = {
      
      id: ids,
      buName: this.buName,
      buid: this.buid,
      

      // buHeadENo: this.buHeadENo,
      buHeadName: this.buHeadName,
      buHeadEmail: this.buHeadEmail,
      sectionName: this.sectionName,


      sectionID: this.sectionID,
      // sectionHeadENo: this.sectionHeadENo,
      sectionHeadName: this.sectionHeadName,
      sectionHeadEmail: this.sectionHeadEmail,
      
      
      // departmentName: this.departmentName,

      // departmentID: this.departmentID,
      // departmentHeadENo: this.departmentHeadENo,
      // departmentHeadName: this.departmentHeadName,

      // departmentHeadEmail: this.departmentHeadEmail,
      // groupName: this.groupName,
      // groupId: this.groupId,

      // groupManagerENo: this.groupManagerENo,
      // groupManagerName: this.groupManagerName,

      // groupManagerEmail: this.groupManagerEmail,

      // source: this.source,

      // isActive: this.isActive,
      isActive: true,
      // createdDate : this.datePipe.transform(this.createdDate, 'yyyy-MM-dd'),
      createdDate : formattedDate,

      createdBy:  0,
      // updatedDate: this.datePipe.transform(this.createdDate, 'yyyy-MM-dd'),
      // updatedBy: this.updatedBy,
    
    };

    console.log('dates');
    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Organization Structure') },
    });
  }

  public routerdata: any;
  title = 'Create Organization Structure Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;



  id = '0';
  buName = '';
  buid = '';

  buHeadENo = '';
  buHeadName = '';
  buHeadEmail = '';

  sectionName = '';
  sectionID = '';
  sectionHeadENo = '';

  sectionHeadName = '';
  sectionHeadEmail = '';
  departmentName = '';

  departmentID = '';
  departmentHeadENo = '';
  departmentHeadName = '';

  departmentHeadEmail = '';
  groupName = '';
  groupId = '';

  groupManagerENo = '';
  groupManagerName = '';
  groupManagerEmail = '';

  source = '';
  isActive = '';
  createdDate = new Date();

  createdBy = '';
  updatedDate = new Date();
  updatedBy = '';
}
