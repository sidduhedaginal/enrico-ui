import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public sowJdId:string = localStorage.getItem("sowJdId") ?? "";
  constructor() { }
}
