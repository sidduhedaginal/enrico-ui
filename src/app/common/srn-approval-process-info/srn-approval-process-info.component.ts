import { Component, Input, OnInit } from '@angular/core';
import { config } from 'src/app/config';
import { LoaderService } from 'src/app/services/loader.service';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { SrnService } from 'src/app/services/srn.service';

@Component({
  selector: 'app-srn-approval-process-info',
  templateUrl: './srn-approval-process-info.component.html',
  styleUrls: ['./srn-approval-process-info.component.scss'],
})
export class SRNApprovalProcessInfoComponent implements OnInit {
  dateFormat = config.dateFormat;
  dateTimeFormat = config.dateTimeFormat;

  srnJdDetail: any;
  @Input() srnId: string;

  constructor(
    private sowjdDhService: SowjdDhService,
    private loaderService: LoaderService,
    private srnservice: SrnService
  ) {}

  ngOnInit() {
    this.getSRNDetails();
  }

  getSRNDetails() {
    this.loaderService.setShowLoading();
    if (this.srnId) {
      this.srnservice
        .getSRNDetailBySrnId(this.srnId)
        .subscribe((response: any) => {
          if (response.data) {
            this.loaderService.setDisableLoading();
            this.srnJdDetail = response.data;
          }
        });
    }
  }
}
