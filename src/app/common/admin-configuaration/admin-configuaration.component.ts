import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-configuaration',
  templateUrl: './admin-configuaration.component.html',
  styleUrls: ['./admin-configuaration.component.css']
})
export class AdminConfiguarationComponent implements OnInit{
  selectedTab = 0;
  ngOnInit(): void {
    
  }
  tabChanged(event:any){
    this.selectedTab = event.index;
  }
}
