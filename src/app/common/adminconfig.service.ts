import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminconfigService {

  constructor(private http: HttpClient) {}
  private baseUrl = environment.commonAPI;

  ////////////////////////////////////////////////////////////
  getModules(){
    const url = `${this.baseUrl}/api/Modules`;
    return this.http.get(url);  
  }

  addModule(data:any){
    const url = `${this.baseUrl}/api/Modules`;
    return this.http.post(url,data);  
  }

  updateModule(data:any){
    const url = `${this.baseUrl}/api/Modules`;
    return this.http.put(url,data);  
  }

  getModuleById(id:string){
    const url = `${this.baseUrl}/api/Modules/${id}`;
    return this.http.get(url); 
  }

  deleteModuleById(id:string){
    const url = `${this.baseUrl}/api/Modules/${id}`;
    return this.http.delete(url); 
  }

  ////////////////////////////////////////////////////////////////////////////////////
  getFeatures(){
    const url = `${this.baseUrl}/features`;
    return this.http.get(url);  
  }

  addFeature(data:any){
    const url = `${this.baseUrl}/features`;
    return this.http.post(url, data);  
  }

  updateFeature(data: any){
    const url = `${this.baseUrl}/features`;
    return this.http.put(url,data);
  }

  deleteFeature(id:string){
    const url = `${this.baseUrl}/features/${id}`;
    return this.http.delete(url)
  }
  /////////////////////////////////////////////////////////////
  getEntities(){
    const url = `${this.baseUrl}/entities`;
    return this.http.get(url);  
  }

  addEntities(data : any){
    const url = `${this.baseUrl}/entities`;
    return this.http.post(url, data);  
  }

  updateEntities(data:any){
    const url = `${this.baseUrl}/entities`;
    return this.http.put(url, data);   
  }

  deleteEntities(id: string){
    const url = `${this.baseUrl}/entities/${id}`;
    return this.http.delete(url)
  }
  //////////////////////////////////////////////////////////////////
  getEntityAdmin(){
    const url = `${this.baseUrl}/entity-admins`;
    return this.http.get(url);  
  }

  addEntityAdmin(data : any){
    const url = `${this.baseUrl}/entity-admins`;
    return this.http.post(url, data);  
  }

  updateEntityAdmin(data:any){
    const url = `${this.baseUrl}/entity-admins`;
    return this.http.put(url, data);   
  }

  deleteEntityAdmin(id: string){
    const url = `${this.baseUrl}/entity-admins/${id}`;
    return this.http.delete(url)
  }
  //////////////////////////////////////////////////////////////////////////
    
}
