import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanningListService {
  private selectedRow : any = [] ;
  constructor(private http: HttpClient,
  ) { }
    
    getCFCyclesMasterData(menuIdData : any){
      const url=`https://enrico-dev-si-webapp-appservice3-01.azurewebsites.net/api/master-data?menuId=${menuIdData}`;
      return this.http.get(url);
    }
     
    aopplanninglist(data :any){
      this.selectedRow = data
    }
    getAopPlanning(){
      return this.selectedRow
    }
}
