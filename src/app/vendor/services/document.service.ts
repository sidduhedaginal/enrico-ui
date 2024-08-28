import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient,  @Inject ('MASTER_API_URL') private sowjd_url :string) { }

  getAllDocumentsBySowJdId(sowjdId:any){
    return this.http.get(
      `${this.sowjd_url}/api/sowjd/sowjd-documents/${sowjdId}`
    );
  }
}
