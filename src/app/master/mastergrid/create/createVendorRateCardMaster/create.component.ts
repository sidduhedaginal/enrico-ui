import { Component, Inject, OnInit } from '@angular/core';
import { VendorRateCard } from '../vendorRateCard.model';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';




@Component({
  selector: 'lib-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [DatePipe],
})

export class CreateComponent implements OnInit {


  // inputBackgroundColor: string = "";
  // changeBackgroundColor(color: string) {
  //   this.inputBackgroundColor = color;
  // }


  public vendorRateCard: VendorRateCard = new VendorRateCard();
  public showloader = false;


  public vendorRateCardId = "";
  public companyCode = "";
  public companyCurrency = "";

  

  public vendorName = "";
  public vendorSapid	= "";
  public locationMode = "";

  


  public grade = "";
  public price = "";
  // public status = "";
  public skillsetName = "";
  
  public remark = "";
  public modifiedDate = new Date();;



  // public skillsetID = -1;

  // public vendorRateCardId = "";
  // public companyCode = "";
  // public vendorSapid = "";


  public skillSetId = "";
  public companyId = "";
  // public grade = "";
  // public price = "";
  

  // public modifiedDate= "";
  // public status = "";
  // public locationMode = "";
  // public remark = "";
  public approvedStatus= "";

  // public locationMode = 'Bosch';
  // public modifiedDate =  new Date();




  // public  vendorRateId = "";
  public vendorid = -1;  
  public companyid = "";

  // public vendorName = '';
  // public vendor_SAP_ID = '';
  // public companyCode = '6520';
  // public locationMode = 'Bosch';
  public currency = 'INR';



  // public vendorRateCardId = 0;
  public validStartDate = new Date();
  public validEndtDate = new Date();
  public validStartDateNew="";

  public gradeId = 0;
  public grade0 = 0;
  public grade1 = 0;
  public grade2 = 0;
  public grade3 = 0;
  public grade4 = 0;
  // public price = 0;
  // public remarks = "";

  errorMessage = '';
  title = 'Create Vendor Rate Master Data';
  isCreate = true;
  
  skillset_card: any = [];
  grade_list: any = [];

  vendor_card: any = [];
  company_list : any = [];
  selectedStatus = true;
  
  constructor(
    private datePipe: DatePipe,
    @Inject('MASTER_API_URL') private url: string,
    private _http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}


  public routerdata: any;

  public status = [
    {
      name: 'Active',
      value: true,
    },
    {
      name: 'Deactive',
      value: false,
    },
  ];

  ngOnInit(): void {
    this.showloader = true;

    this.activatedRoute.queryParams.subscribe((params) => {
       this.routerdata = params;
     });

    if (this.routerdata.data > 0) {
      this.isCreate = false;
    }

    this.getFilters();

    if (this.routerdata.data !=null) {
      fetch(
        `${this.url}/api/VendorRateCardMaster/GetVendorRateCardById?rateCardId=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {

          console.log("path data");
          console.log(data);


          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {

            this.title = 'Update Vendor Rate Master Data';
            this.vendorRateCardId = data.result.vendorRateCardId;
            // revert for dummy data;
            this.companyCode = data.result.companyCode;
            // this.companyId = data.result.companyCode;


            this.vendorName = data.result.vendorName;
            this.vendorSapid = data.result.vendorSapid;
            // this.vendorSapid = data.result.vendorSapid;
            this.locationMode = data.result.locationMode;
            //this.currency = data.result.currency;
            this.skillSetId = data.result.skillSetId;
            this.gradeId =
              data.result.gradeId == null ? 0 : data.result.grade;
            this.price = data.result.price == null ? 0 : data.result.price;

            console.log("path data");

            console.log(data.result);
            this.modifiedDate = new Date(data.result.modifiedDate);
            this.validStartDate = new Date(data.result.validityStart);

            this.validEndtDate = new Date(data.result.validityEnd);

            this.vendorRateCardId = data.result.vendorRateCardId;
            this.remark = data.result.remark;

            this.setClusterName();

          }
        });
    }

    this.showloader = false;
  
  }

  setClusterName(){

    for (let index = 0; index < this.skillset_card.length; index++)
    {
      console.log(this.skillset_card[index]);
      console.log(this.skillSetId);
      if (this.skillset_card[index].skillSetId == this.skillSetId)
      {
        this.clusterName = this.skillset_card[index].clusterName;
      }
    }
  }

  getFilters() {
    this.showloader = true;

    fetch(

          `${this.url}/api/VendorRateCardMaster/GetVendorFilters`
          
          )
      .then(function (response) {
        return response.json();
      })
      .then((data) => {

        console.log("filter data");
        console.log(data);

        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          
          if (data.result.listVendorMaster != null) {


            this.vendor_card = data.result.listVendorMaster;
            console.log("this vendor_card values");
            console.log(this.vendor_card);
            
          }
          if (data.result.listSkillsetMaster != null) {
                   
            this.skillset_card = data.result.listSkillsetMaster;
          }
          if (data.result.listGradeMaster != null) {
            this.grade_list = data.result.listGradeMaster;
          }

          if ( data.result.listCompanyMaster != null)
          {
            this.company_list = data.result.listCompanyMaster;
          }
          this.showloader = false;   
          // this.setClusterName();
        }
      });
  }

  public locationModes = [
    'Bosch',
    'Bosch BGSW',
    'Competency Unit at Bosch',
    'Competency Unit at Partner',
    'Customer Location',
  ];

  public clusterName = '';

  onSkillSetChange() {
    for (let index = 0; index < this.skillset_card.length; index++) {
      if (this.skillset_card[index].skillSetId == this.skillSetId) {
        this.clusterName = this.skillset_card[index].clusterName;
      }
    }
  }
  onVendorChange() {

    console.log("function called");
    for (let index = 0; index < this.vendor_card.length; index++) {
      if (this.vendor_card[index].vendorId == this.vendorid) {

        console.log(this.vendor_card[index]);
        this.vendorSapid = this.vendor_card[index].vendorSapid;
        // this.location_mode=this.vendor_card[index].location;
        //this.currency = this.vendor_card[index].currency;
        this.vendorName = this.vendor_card[index].vendorName;

      }
    }
  }

  saveVendorRateCard() {

    this.showloader = true;
    this.errorMessage = '';
    
    if (
      
      this.vendorid <= 0 ||
      this.locationMode == '' ||
      this.skillSetId <= '' ||
      this.skillSetId == '' ||
      this.validStartDate == null ||
      this.validEndtDate == null
      
     ) {
      this.errorMessage = 'Please fill all mandatory (*) fields.';
      this.showloader = false;
      return false;
    }
    else if (this.validStartDate >= this.validEndtDate) {
      this.errorMessage =
        'Valid end date should be greater than valid start date';
      this.showloader = false;
      return false;
    } else {

      var formdata = new FormData();
      // "{vendorRateCardId:'" +
      // this.vendorRateCardId +
      // "',companyCode:'" +
      // this.companyCode +
      // "',vendorName:'" +
      // this.vendorName +
      // "',vendorSapid:'" +
      // this.vendorSapid +
      // "',locationMode:'" +
      // this.locationMode +
      // "',currency:'" +
      // this.currency +
      // "',skillSetId:'" +
      // this.skillSetId +
      // "',grade:'" +
      // this.gradeId +
      // "',price:'" +
      // this.price +
      // "',inputValidStartDate:'" +
      // this.datePipe.transform(this.validStartDate, 'dd-MM-yyyy') +

      // "'," +
      // "inputValidEndDate:'" +
      // this.datePipe.transform(this.validEndtDate, 'dd-MM-yyyy') +
      // "',    vendorId:'" +
      // this.vendorid +
      // "'   }"


      formdata.append(

        'input',this.getString()

      );


      console.log(formdata);

      var requestOptions: RequestInit = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
      };

      var url = this.url + '/api/VendorRateCardMaster/CreateVendorRateCard';

      if (!this.isCreate) {
        url = this.url + '/api/VendorRateCardMaster/UpdateVendorRateCard';
      }

      fetch(url, requestOptions)
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
           this.showloader = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else {
            this.router.navigate(['/dashboard'], {
              queryParams: {
                routertitle: JSON.stringify('Vendor Rate Card Master'),
              },
            });
          }
        });

      return true;
    }
  }
  
  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getString(): string {

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    console.log('before');

    // console.log(this.validityStart);
    // console.log(this.validityEnd);
    // var ids = 'bea8e72e-085a-4444-9f39-d2133c3ff8ce';
    var ids = this.generateGUID();
    
    
    if (!this.isCreate) {
      ids = this.vendorid.toString();
    }

    
    const inputObject = {

      vendorRateCardId: ids,
      companyCode: this.companyCode,
      vendorName: this.vendorName,
      vendorSapid: this.vendorSapid,
      locationMode: this.locationMode,
      currency: this.currency,
      skillSetId: this.skillSetId,
      grade: this.gradeId,
      price: this.price,
      modifiedDate : this.datePipe.transform(this.modifiedDate, 'yyyy-MM-dd'),


      // inputValidStartDate: this.datePipe.transform(this.validStartDate, 'dd-MM-yyyy'),
      // inputValidEndDate: this.datePipe.transform(this.validEndtDate, 'dd-MM-yyyy'),
      // vendorId: this.vendorid

    };

    console.log('dates');

    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }


  cancelVendorRateCard() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Vendor Rate Card Master') },
    });
  }
  onEndDateChange(event: any) {
    console.log(event);
  }

  onKeyDownforGraid(event: any) {
    // this.dataValue=this.params.value;
    if (
      event.keyCode === 8 ||
      event.keyCode === 46 ||
      event.keyCode === 37 ||
      event.keyCode === 39
    ) {
      return true;
    }

    if (event.target.value === undefined) {
      return false;
    } else if (event.target.value.length >= 20) {
      event.preventDefault();

      return true;
    }
    if (event.key == '.') {
      if (event.target.value.includes('.')) {
        event.preventDefault();
      }
      return true;
    } else if (!isNumeric(event)) {
      //event.preventDefault();

      return false;
    } 
    else if (event.target.value.includes('.') && event.key != '.') {
      let myarr = (event.target.value + event.key).split('.');
      if (myarr[1].length > 3) {
        event.preventDefault();
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }

    function isNumeric(ev: any) {
      return /\d/.test(ev.key);
    }
    return true;
  }

  checkPriceLength(number: number): boolean {

    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
  
    if (decimalIndex === -1) {
      
      // No decimal point found
      if(numberString.length > 20) return true;
      else return false;

    } else {
      // Decimal point found
      const digitsBeforeDecimal = numberString.substring(0, decimalIndex);
      
      if(numberString.length > 20) return true;
      else return false;

    }
  
  }
}
