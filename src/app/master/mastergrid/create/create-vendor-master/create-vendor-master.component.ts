import { Component, OnInit, Inject } from '@angular/core';
import { MatDatePickerComponent } from './date-editor.component';
import { DocimalRateValidate } from '../docimal-rate.component';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'lib-create-vendor-master',
  templateUrl: './create-vendor-master.component.html',
  styleUrls: ['./create-vendor-master.component.css'],
  providers: [DatePipe],
})

export class CreateVendorMasterComponent implements OnInit {
  constructor(
    private datePipe: DatePipe,
    @Inject('MASTER_API_URL') private url: string,
    private _http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.frameworkComponents = { datePicker: MatDatePickerComponent };
  }

  public isCreate = true;

  title = 'Create  Vendor Master Data';
  public routerdata: any;

  vendorName = ""; 
  vendorCode = "";
  classifications = ['Strategic', 'Non-Strategic', 'Corporate', 'Niche'];

  currencys = ['INR', 'VND', 'USD', 'EUR'];

  currency = "";

  countryList = ["INDIA","USA", "EUROPE"];
  country = '';

  parentVendorList = ["Venor1", "Vendor2", "Vendor3"];

  // stateList = ["state1", "state2"];
  state = "";
  city = "";
  address = "";

  parentVendor = "";
  

  
 



  public vendorId = 0;
  public vendor_sap_id = '';
  public company_Code = '6520';
  public vendor_name = '';
  public vendor_type = '';
  public parent_vendor = '';
  // public city = '';
  public classification = '';
  // public country = '';
  public business_support = '';
  public primary_contact_name = '';
  public selectedCurrency = '';
  public selectedStatus = '';
  // public state = '';

  public vendorList: any = [];

  public showloader = false;
  // public validity_startDate = new Date();
  // public validity_endDate = new Date();

  errorMessage = '';

  // public validStartDate = new Date();
  // public validEndtDate = new Date();
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      this.routerdata = params;
      console.log(this.routerdata); // price
    });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    this.getVendorList();

    if (this.routerdata.data > 0) {
      fetch(`${this.url}/api/VendorMaster/get/${this.routerdata.data}`)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;

          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {

            this.title = 'Update Vendor  Master Data';
            this.isCreate = false;
            this.vendorId = data.result.vendorId;
            this.vendor_sap_id = data.result.vendorSapid;
            this.vendor_name = data.result.vendorName;
            this.vendor_type = data.result.vendorType;
            this.parent_vendor = data.result.parentVendor;

            this.city = data.result.city;
            this.classification = data.result.classification;
            this.country = data.result.country;
            this.company_Code = data.result.companyCode;
            this.business_support = data.result.businessSupport;
            this.primary_contact_name = data.result.primaryContactName;
            this.selectedCurrency = data.result.selectedCurrency;
            this.selectedStatus = data.result.isActive;
            this.selectedCurrency = data.result.currency;
            this.state = data.result.state;

            this.rowDataContactDetails = data.result.contactDetails;

            // this.grid2Api.setRowData(this.rowDataContactDetails);

            //console.log(data.result.escalationMatrices);
            this.rowDataEscalationMatrix = data.result.escalationMatrices;
            //this.grid1Api.setRowData(this.rowDataEscalationMatrix);
          }
        });
    }
  }

  getVendorList() {
    this.showloader = true;

    fetch(
      `${this.url}/api/VendorMaster/GetVendorList?companycode=${this.company_Code}`
    )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          this.vendorList = data.result;
          // console.log(data.result);
        }
      });
  }
  onGrid2Ready(params: any) {
    this.grid2Api = params.api;
  }

  grid2Api: any;
  grid1Api: any;
  grid3Api: any;

  showContactDetails = false;
  showEscalation = false;
  showSkillSet = false;

  onGridReadyEscalationMatrix(params: any) {
    this.grid1Api = params.api;
  }

  onGridReadyContactDetails(params: any) {
    this.grid2Api = params.api;
  }

  columnDefsEscalationMatrix = [
    { headerName: 'Name', field: 'name', editable: true },
    { headerName: 'Designation', field: 'designation', editable: true },
    { headerName: 'Email', field: 'email', editable: true },
    { headerName: 'Mobile', field: 'mobile', editable: true },
    {
      headerName: 'Domain Responsible',
      field: 'domainResponsible',
      editable: true,
    },
    {
      headerName: 'Escalation Level',
      field: 'escalationLevel',
      editable: true,
    },
    { headerName: 'Id', field: 'Id', editable: false, hide: true },
  ];

  rowDataEscalationMatrix: any[] = [];

  
  

  addNewEscaltion() {
    const newRow = {
      name: '',
      designation: '',
      email: '',
      mobile: '',
      domainResponsible: '',
      escalationLevel: '',
    };
    this.rowDataEscalationMatrix.push(newRow);
    this.grid1Api.setRowData(this.rowDataEscalationMatrix);
  }

  // { headerName: 'Contact Name', field: 'contactName',editable: true},
  // { headerName: 'Email', field: 'email' ,editable: true},
  // { headerName: 'Country Code', field: 'countryCode',editable: true},
  // { headerName: 'Mobile', field: 'mobile',editable: true},
  // { headerName: 'Designation', field: 'designation',editable: true},
  // { headerName: 'Notes', field: 'notes',editable: true},

  addNewContact ()
  {

  }
  
  // addNewContact() {
  //   const newRow = {
  //     contactName: '',
  //     email: '',
  //     countryCode: '',
  //     mobile: '',
  //     designation: '',
  //     notes: '',
  //   };
  //   this.rowDataContactDetails.push(newRow);
  //   this.grid2Api.setRowData(this.rowDataContactDetails);
  // }


  columnDefsContactDetails = [

    { headerName: 'Contact Name', field: 'contactName', editable: true },
    { headerName: 'Email', field: 'email', editable: true },

    // { headerName: 'Country Code', field: 'countryCode', editable: true },

    { headerName: 'Mobile', field: 'mobile', editable: true },
    { headerName: 'Designation', field: 'designation', editable: true },
    {headerName: 'Domain Responsibility', field: 'domainResponsibility',editable: true },

    // { headerName: 'Notes', field: 'notes', editable: true },
    // { headerName: 'Id', field: 'Id', editable: false, hide: true },

    {headerName: 'Escalate Level', field: 'escalateLevel', editable :true},

    {headerName: 'Primary Contact', field: 'primaryContract',editable:false,
    
    colId:"action",
    
    cellRenderer: function cellTitle() {
      let cellValue = '<div class="ngSelectionCell"><input name="selected" type="radio"></div>';
      return cellValue;
    },
  },
    

  //   {headerName: 'Primary Contact', field: 'primaryContract', editable: true,

  //     { field: '',editable:false,colId:"action", cellRenderer: function cellTitle() {
  //       let cellValue = '<div class="ngSelectionCell"><input name="selected" type="radio"></div>';
  //       return cellValue;
  //     }
  // }},

    // {headerName: 'Status', field: 'status', checkboxSelection: true,  editable: true}, 
    // { field: '',editable:false,colId:"action",cellRenderer: function()
    //   {
    //     return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons"style="color:#cf2a27">edit</span>' +
    //     + '<span class="material-icons"style="color:#cf2a27">delete_outline</span>'  + 
    //     '</div>';
    //   },
    //   maxWidth:80
    // },


    {headerName: 'Status', field: 'status',editable:true, 

    
    // cellRenderer: function cellTitle() {
    //   let cellValue = '<div class="ngSelectionCell"><input name="selected" type=""checkbox""></div>';
    //   return cellValue;
    // },

    cellRenderer: function cellTitle() {
      let cellValue = '<div class="ngSelectionCell"><input name="selected" type="checkbox"></div>';
      return cellValue;
    },

  },

  //   { field: '',editable:false,colId:"action",cellRenderer: function()
  //   {
  //     return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons"style="color:#cf2a27">edit</span>' +
  //     + '<span class="material-icons"style="color:#cf2a27">delete_outline</span>'  + 
  //     '</div>';
  //   },
  //   maxWidth:80
  // },

  { field: '',editable:false,colId:"action",cellRenderer:this.actionCellRenderer
  }


  

  //   { field: '',editable:false,colId:"action", cellRenderer: function cellTitle() {

  //     let cellValue = '<div class="ngSelectionCell"><input name="selected" type="radio"></div>';
  //     return cellValue;
  //   },
  // }

  ];

  columnDefsRateCardDetails = [
    { headerName: 'No.', field: 'srno', editable: true, hide: true },
    { headerName: 'Skillset', field: 'skillset', editable: true },
    {
      headerName: 'Grade 0',
      field: 'grade0',
      editable: true,
      cellEditor: DocimalRateValidate,
    },
    {
      headerName: 'Grade 1',
      field: 'grade1',
      editable: true,
      cellEditor: DocimalRateValidate,
    },
    {
      headerName: 'Grade 2',
      field: 'grade2',
      editable: true,
      cellEditor: DocimalRateValidate,
    },
    {
      headerName: 'Grade 3',
      field: 'grade3',
      editable: true,
      cellEditor: DocimalRateValidate,
    },
    {
      headerName: 'Grade 4',
      field: 'grade4',
      editable: true,
      cellEditor: DocimalRateValidate,
    },
    {
      headerName: 'Valid Start Date',
      field: 'validStartDate',
      cellEditor: MatDatePickerComponent,
      editable: true,
    },
    {
      headerName: 'Valid End Date',
      field: 'validEndDate',
      cellEditor: MatDatePickerComponent,
      editable: true,
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.addRateCardToGrid,
      editable: false,
    },
  ];
  frameworkComponents: any;

  // rowDataContactDetails: any = [];
  rowDataContactDetails = [
    {
      contactName: 'John Doe',
      email: 'johndoe@example.com',
      mobile: '1234567890',
      designation: 'Manager',
      domainResponsibility: 'Sales',
      escalateLevel: 'High',
      primaryContract: true,
      status: true
    },
    {
      contactName: 'Jane Smith',
      email: 'janesmith@example.com',
      mobile: '9876543210',
      designation: 'Engineer',
      domainResponsibility: 'Technology',
      escalateLevel: 'Medium',
      primaryContract: false,
      status: false
    },
    // Add more rows as needed
  ];



  rowDataRateCard: any = [];

  vendor_types = ['Corporate', 'Subsidiary'];
 
  businessSupports = ['Bosch', 'Global', 'Bosch and Global'];
  // currencys = ['INR', 'VND', 'USD', 'EUR'];
  status = [
    { name: 'Active', value: true },
    { name: 'Inactive', value: false },
  ];
  public pinnedRateCardTopRowData: any[] = this.createRateCardTopData();

  addRateCardToGrid(param: any) {
    if (
      param.data.srno == null ||
      param.data.srno == '' ||
      param.data.srno == undefined
    ) {
      return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975">save</mat-icon>  </span>';
    } else {
      return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975">delete</mat-icon>  </span>';
    }
  }

  onVendorTypeChange() {}

  onClassificationChange() {}

  onbusiness_support_change() {}
  onCurrencyChange() {}
  onSatusChange() {}

  toggal(toggalDiv: any) {
    console.log(toggalDiv);
    if (toggalDiv == 'skillset') {
      if (this.showSkillSet == true) {
        this.showSkillSet = false;
      } else if (this.showSkillSet == false) {
        this.showSkillSet = true;
      }
    }
    if (toggalDiv == 'contact') {
      if (this.showContactDetails == true) {
        this.showContactDetails = false;
      } else if (this.showContactDetails == false) {
        this.showContactDetails = true;
      }
    }
    if (toggalDiv == 'escalation') {
      if (this.showEscalation == true) {
        this.showEscalation = false;
      } else if (this.showEscalation == false) {
        this.showEscalation = true;
      }
    }
  }

  onGridReadySkillSet(params: any) {
    this.grid3Api = params.api;
  }

  onRateCardCellClicked(params: any) {
    if (params.column.colId === 'action') {
      let actionClicked = params.event.target.innerText;
      if (actionClicked === 'save') {
        var newdata = {
          srno: this.rowDataRateCard.length + 1,
          skillset: params.data.skillset,
          grade0: params.data.grade0,
          grade1: params.data.grade1,
          grade2: params.data.grade2,
          grade3: params.data.grade3,
          grade4: params.data.grade4,
          validStartDate: params.data.validStartDate,
          validEndDate: params.data.validEndDate,
        };

        this.rowDataRateCard.push(newdata);
        this.rowDataRateCard.sort((a: any, b: any) => b.srno - a.srno);
        this.grid3Api.setRowData(this.rowDataRateCard);

        this.grid3Api.setPinnedTopRowData([
          {
            srno: null,
            skillset: 'Select Skill Set',
            grade0: 0,
            grade1: 0,
            grade2: 0,
            grade3: 0,
            grade4: 0,
            validStartDate: new Date(),
            validEndDate: new Date(),
          },
        ]);
      } else if (actionClicked === 'delete') {
        this.rowDataRateCard.splice(params.rowIndex, 1);

        this.grid3Api.setRowData(this.rowDataRateCard);
      }
    }
  }

  createRateCardTopData(): any[] {
    var result: any[] = [];

    result.push({
      srno: null,
      skillset: 'Select Skill Set',
      grade0: 0,
      grade1: 0,
      grade2: 0,
      grade3: 0,
      grade4: 0,
      validStartDate: new Date(),
      validEndDate: new Date(),
    });

    return result;
  }

  saveMaster() {
    // this.showloader = true;
    this.errorMessage = '';
    if (
      // this.vendorId === 0 ||
      this.vendor_sap_id === '' ||
      this.company_Code === '' ||
      this.vendor_name === '' ||
      this.vendor_type === '' ||
      this.parent_vendor === '' ||
      this.city === '' ||
      this.classification === '' ||
      this.country === '' ||
      this.business_support === '' ||
      this.primary_contact_name === '' ||
      this.selectedCurrency === '' ||
      this.selectedStatus === '' ||
      this.state === ''
    ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      this.showloader = false;
      return false;
    } else {
      // var stringData = this.vendor.toString();
      var formdata = new FormData();

      formdata.append('input', this.getString());

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/VendorMaster/create';

      if (!this.isCreate) {
        url = this.url + '/api/VendorMaster/update';
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
          } else {
            // alert(data.message);

            console.log(data.message);
            this.router.navigate(['/dashboard'], {
              queryParams: {
                routertitle: JSON.stringify('Vendor Master'),
              },
            });
          }
        });

      return true;
    }
  }

  getString(): string {
    const inputObject = {
      id: this.vendorId,
      VendorSapid: this.vendor_sap_id,
      vendorName: this.vendor_name,
      vendorType: this.vendor_type,
      parentVendor: this.parent_vendor,
      city: this.city,
      classification: this.classification,
      country: this.country,
      companyCode: this.company_Code,
      businessSupport: this.business_support,
      primaryContactName: this.primary_contact_name,
      selectedCurrency: this.selectedCurrency,
      isActive: this.selectedStatus,
      currency: this.selectedCurrency,
      state: this.state,
      status: this.selectedStatus,
      contactDetails: this.rowDataContactDetails,
      escalationMatrices: this.rowDataEscalationMatrix,
    };

    console.log('created objects');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

  actionCellRenderer(params:any) {

    return '<button style="background:none;border:none;outline: none;" data-action="skillset"> <mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#black">visibility</mat-icon> </button> '+
    '<button style="background:none;border:none;outline: none;" data-action="skillset"> <mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#cf2a27">delete</mat-icon></button>';
}


}
