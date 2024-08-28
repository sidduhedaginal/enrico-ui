export interface SRNDetails {
    id: number;
    name:string;
    isLocked:string;
    sowjd: string;
    fromDate: string;
    toDate:string;
    purchaseOrder:string;
    country:string;
    orderCurrency:string;
    potype:string;
    poValidityStart:string;
    poValidityEnd:string;
    dmName:string;
    dmEmail:string;
    vendorName:string;
    vendorID:string;
    vendorEmail:string;
    resourcePlan:ResourcePlan[];
    equivalantCapacity:string;
    rateCard:string;
    equivalantPMO:string;
    totalCost:string;
    deliveryManagerRemarks:string;
    billMonth?:string;
    invoice?:string;
    remarks?:string;
    files?:any[];
  }
  export interface ResourcePlan {
    id: number;
    skillSet:string;
    grade: string;
    quantity: string;
    noOfMonths:string;
    pmo:string;
    cost:string;
    price:string;
  }