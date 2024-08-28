import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImportdataService {
  private importdata : any = [] ;
  private file:any;
  private base64StringOfUploadedExcel : any;
  public processFileResponse = [];
  constructor() { }


  selecteditem(item :any){
    this.importdata = item
   }


  selectedFile(file:any){
    this.file=file;
  }

  selectedBase64(item:string)
  {
    this.base64StringOfUploadedExcel = item;
  }
  getBase64Format()
  {
    return this.base64StringOfUploadedExcel;
  }

  getSeletedFile(){
    return this.file;
  }

  getselectitem(){

    return this.importdata;
  }

  setProcessApiResponse(response: any){
    
    this.processFileResponse = response;

  }
  getProcessApiResponse() {

    return this.processFileResponse;
    
  }


}
