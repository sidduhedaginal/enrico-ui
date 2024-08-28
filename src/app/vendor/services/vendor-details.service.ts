import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VendorDetailsService {

  constructor(private http: HttpClient,  @Inject ('Vendor_URL') private vendor_url :string) { }

  getVendorDetails(vendorSAPId:number){
    return this.http.get(
      `${this.vendor_url}/api/vendors/${vendorSAPId}`
    );
  }
  getVendorDropdownValues(){
    return this.http.get(
      `${this.vendor_url}/api/vendors/vendor-master-data`
    );
  }

  updateVendorDetails(input:any){
    return this.http.put(
      `${this.vendor_url}/api/vendors/Update-Vendor-Details`,input
    );
  }

  getContactDetails(vendorId:string){
    return this.http.get(
      `${this.vendor_url}/api/vendors/getContact-list/{vendorId}?vendorid=${vendorId}`
    );
  }

  addContactDetails(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/create-Contact`,input
    );
  }
  updateContactDetails(input:any){
    return this.http.put(
      `${this.vendor_url}/api/vendors/update-vendor-contactdetails`,input
    );
  }

  deleteContactDetails(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/delete-vendorcontact`,input
    );
  }

  getSubsidaryDetails(vendorId:string){
    return this.http.get(
      `${this.vendor_url}/api/vendors/getSubsidiary-vendorslist/${vendorId}`
    );
  }

  deleteSubsidary(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/delete-subsidiaryvendor`,input
    );
  }

  getGradeDetails(vendorId:string){
    return this.http.get(
      `${this.vendor_url}/api/vendors/get-AllGrades-ByVendorId/${vendorId}`
    );
  }
}
