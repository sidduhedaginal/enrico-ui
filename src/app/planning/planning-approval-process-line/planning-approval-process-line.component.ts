import { Component, Input } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';import { config } from 'src/app/config';
import { PlaningService } from '../services/planing.service';

@Component({
  selector: 'app-planning-approval-process-line',
  templateUrl: './planning-approval-process-line.component.html',
  styleUrls: ['./planning-approval-process-line.component.css']
})
export class PlanningApprovalProcessLineComponent {
  dateFormat = config.dateFormat;
  sowJdDetail: any;
  @Input() planningid: string;
  @Input() SecondLevelId: string;
  metadata : any;
  apiResponse : any;

  constructor(
    private loaderService: LoaderService,
    private planningService : PlaningService
  ) {}

  ngOnInit() {
    if(this.planningid){
      this.getFirstLevelDetails();
    }else if(this.SecondLevelId){
      this.getSecondLevelDetail();
    }
    
  }
  getFirstLevelDetails(){
    this.loaderService.setShowLoading();
    this.planningService.GetAOPDetails(this.planningid).subscribe({
      next: (res:any) => {
        this.apiResponse = res.data;
        console.log("response",res.data);
        this.metadata = res.data.metadata;     
        this.loaderService.setDisableLoading();
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });
  }

  getSecondLevelDetail(){
    this.loaderService.setShowLoading();
    this.planningService.GetSecondLevelDetails(this.SecondLevelId).subscribe({
      next: (res:any) => {
        this.apiResponse = res.data;       
        this.metadata = res.data.metadata;
        this.loaderService.setDisableLoading();
     
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });
  }


}
