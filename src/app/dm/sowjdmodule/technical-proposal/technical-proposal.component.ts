import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { config } from 'src/app/config';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { HomeService } from 'src/app/services/home.service';
import { SowjdTechnicalProposalService } from 'src/app/services/sowjd-technical-proposal.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'lib-technical-proposal',
  templateUrl: './technical-proposal.component.html',
  styleUrls: ['./technical-proposal.component.scss'],
})
export class TechnicalProposalComponent implements OnInit {
  dateFormat = config.dateFormat;
  @Input() sowJdId: string = '';
  technicalProposalDetails: any = [];
  loader: boolean;
  approvalSignOffData: any;
  actionFormDM!: FormGroup;
  actionFormSecSpoc!: FormGroup;
  vendorId: string;
  technicalProposalId: string;
  technicalProposalData: any;
  areAnyRecords: boolean = true;
  PORemarks: any;

  constructor(
    private homeService: HomeService,
    private dialog: MatDialog,
    private router: Router,
    private sowjdTechnicalProposalService: SowjdTechnicalProposalService,
    private fb: FormBuilder
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  public columnDefsForApprovalSignOff = [
    {
      headerName: 'Name',
      field: 'name',
    },
    {
      headerName: 'Email ID',
      field: 'email',
    },
    {
      headerName: 'Role',
      field: 'role',
    },
    {
      headerName: 'Status',
      field: 'status',
    },
  ];
  public columnDefsResourcePlan = [
    {
      headerName: 'Skillset',
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
    },
    {
      headerName: 'Resource Onboarding Date',
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'PMO',
      field: 'pmo',
    },
    {
      headerName: 'Cost',
      field: 'cost',
    },
    {
      headerName: 'Price',
      field: 'price',
    },
  ];
  public columnDefsInternalCost = [
    {
      headerName: 'Skillset',
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
    },
    {
      headerName: 'PMO',
      field: 'pmo',
    },
    {
      headerName: 'Personal Cost',
      field: 'personalCost',
    },
    {
      headerName: 'OH Cost',
      field: 'ohCost',
    },
  ];

  public columnDefsForPORemarks = [
    {
      headerName: 'PO Number',
      field: 'poNumber',
    },
    {
      headerName: 'PO Remarks',
      field: 'poRemarks',
    },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: false,
    filter: true,
    menuTabs: ['filterMenuTab'],
  };

  private gridApi1!: GridApi;
  private gridApi2!: GridApi;
  private gridApi3!: GridApi;
  private gridApi4!: GridApi;

  onGridReadyVendorResourcePlan(params: GridReadyEvent) {
    this.gridApi1 = params.api;
    this.gridApi1.setDomLayout('autoHeight');
  }

  onGridReadyInternalCost(params: GridReadyEvent) {
    this.gridApi2 = params.api;
    this.gridApi2.setDomLayout('autoHeight');
  }

  onGridReadyApprovalSignOff(params: GridReadyEvent) {
    this.gridApi3 = params.api;
    this.gridApi3.setDomLayout('autoHeight');
  }

  onGridReadyPORemarks(params: GridReadyEvent) {
    this.gridApi4 = params.api;
    this.gridApi4.setDomLayout('autoHeight');
  }

  ngOnInit(): void {
    this.actionFormDM = this.fb.group({
      dmRemarks: ['', Validators.required],
    });
    this.actionFormSecSpoc = this.fb.group({
      secSpocRemarks: ['', Validators.required],
    });

    if (this.sowJdId != null) {
      this.sowjdTechnicalProposalService
        .getsowjdTechProposalDetails(this.sowJdId)
        .subscribe((response: any) => {
          this.technicalProposalData = response.data;
        });

      this.getApprovalSignOffDetails();
      this.getPoRemarks();
    }
  }

  get actionFormDMControl() {
    return this.actionFormDM.controls;
  }

  get actionFormSecSpocControl() {
    return this.actionFormSecSpoc.controls;
  }

  getPoRemarks() {
    this.sowjdTechnicalProposalService
      .getPoRemarksBySowJdId(this.sowJdId)
      .subscribe((response: any) => {
        this.PORemarks = response.data;
      });
  }

  getApprovalSignOffDetails() {
    this.sowjdTechnicalProposalService
      .getApprovalSignOffDetail(this.sowJdId)
      .subscribe((response: any) => {
        this.approvalSignOffData = response.data;
      });
  }

  reloadPage() {
    window.location.reload();
  }

  onSubmitDM() {
    const signOffObj = {
      sowjdId: this.sowJdId,
      remarks: this.actionFormDM.value.dmRemarks,
      rfqId: '2073acb2-f33a-458e-8659-3bf263d0dc62',
    };

    this.sowjdTechnicalProposalService.dmSignOff(signOffObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '500px',
            height: 'auto',
            data: 'Delivery manager Sign Off success',
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            this.reloadPage();
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmitSecSpoc() {
    const signOffObj = {
      sowjdId: this.sowJdId,
      remarks: this.actionFormSecSpoc.value.secSpocRemarks,
      rfqId: '2073acb2-f33a-458e-8659-3bf263d0dc62',
    };

    this.sowjdTechnicalProposalService.secSpocSignOff(signOffObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const dialogRef = this.dialog.open(SuccessComponent, {
            width: '500px',
            height: 'auto',
            data: 'Section Spoc Sign Off success',
          });

          dialogRef.afterClosed().subscribe((result: any) => {
            this.reloadPage();
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
