export interface VendorRateCardList {
    id: string;
    companyCode:string;
    currency:string;
    locationMode:string;
    vendorId: string;
    vendorName: string;
    vendorSAPId:string;
    vendorType:string;
    skillset:Skillset;
    grade:Grade;
    price:string;
    status:string;
    remarks:string;
    createdDate:string;
    createdBy:string;
    modifiedDate:string;
    modifiedBy:string;
    approvedDate:string;
    approvedBy:string;
  }

  export interface Skillset {
    skillsetId:string;
    skillsetName:string   
  }

  export interface Grade {
    gradeMasterId:string;
    name:string   
  }