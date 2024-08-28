import { Component, Input, OnInit } from '@angular/core';
import { config } from 'src/app/config';
import { LoaderService } from 'src/app/services/loader.service';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';

@Component({
  selector: 'app-sowjd-approval-process-info',
  templateUrl: './sowjd-approval-process-info.component.html',
  styleUrls: ['./sowjd-approval-process-info.component.scss'],
})
export class SowjdApprovalProcessInfoComponent implements OnInit {
  dateFormat = config.dateFormat;
  sowJdDetail: any;
  @Input() sowJdId: string;

  constructor(
    private sowjdDhService: SowjdDhService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getSoWJDDetails();
  }

  getSoWJDDetails() {
    this.loaderService.setShowLoading();
    if (this.sowJdId) {
      this.sowjdDhService
        .getSowJdRequestById(this.sowJdId)
        .subscribe((sowJdData: any) => {
          if (sowJdData) {
            this.loaderService.setDisableLoading();
            this.sowJdDetail = sowJdData.data.sowJdEntityResponse;
          }
        });
    }
  }
}
