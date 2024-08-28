import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sowjdService } from '../../services/sowjdService.service';
import { LoaderService } from 'src/app/services/loader.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { WidthdrawComponent } from '../../popup/widthdraw/widthdraw.component';
import { MatDialog } from '@angular/material/dialog';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-sowjd-details',
  templateUrl: './sowjd-details.component.html',
  styleUrls: ['./sowjd-details.component.scss'],
})
export class SowjdDetailsComponent {
  url: string;
  sowjdId: string;
  sowJdDetail: any;
  isExpanded: boolean = false;
  permissionDetails: PermissionDetails;
  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public sowjdservice: sowjdService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();
    });
    this.sowjdId = localStorage.getItem('sowjdId');
    // Using for Roles and Permissions
    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });
  }
  ngOnInit() {
    this.getsowjdRequestbyId();
    this.router.navigate([`my-sowjd/sowjd-detail/sowjd-info`, this.sowjdId]);
  }

  downloadPdf() {
    var dd = {
      pageSize: 'A3',
      content: [
        {
          image:
            'data:image/png;base64,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',
          height: 16,
          width: 800,
          margin: [-10, 0, 0, 15],
        },

        {
          text: 'Bosch Global Software Technologies Private Limited',
          style: 'header',
          margin: [0, 0, 0, 30],
        },
        {
          style: 'tableExample',
          table: {
            margin: [0, 40, 0, 0],
            headerRows: 1,
            body: [
              [
                {
                  text: 'Service Receipt Note ',
                  style: 'header',
                  margin: [160, 0, 0, 15],
                },
                {
                  image:
                    'data:image/png;base64,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',
                  height: 40,
                  width: 200,
                  margin: [60, 0, 0, 15],
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
      ],
      styles: {
        header: {
          fontSize: 32,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black',
        },
        tableHeaderWithBack: {
          bold: true,
          fontSize: 13,
          color: 'black',
          fillColor: '#f5f5f5',
          margin: [0, 0, 0, 10],
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    var pdfName = 'test' + '_.pdf';

    pdfMake.createPdf(dd).download(pdfName);
  }
  getsowjdRequestbyId() {
    this.sowjdservice
      .getSowjdRequestById(this.sowjdId)
      .subscribe((res: any) => {
        if (res.data) {
          this.loaderService.setDisableLoading();
          this.sowJdDetail = res.data.sowJdEntityResponse;
        }
      });
  }
  doWithdraw(status: string) {
    const dialogRef = this.dialog.open(WidthdrawComponent, {
      width: '40vw',
      data: {
        sowjdId: this.sowjdId,
        status: status,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
        this.getsowjdRequestbyId();
        window.location.reload();
      }
    });
  }
  activeItem: string = 'sowjd-info';
  setActiveItem(page: string) {
    this.activeItem = page;
  }
}
