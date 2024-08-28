import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { sowjdService } from '../../services/sowjdService.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocURLComponent } from 'src/app/vendor/shared/doc-url/doc-url.component';
import { Observable, ReplaySubject } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { HomeService } from 'src/app/services/home.service';
import { error } from 'console';
import { DeleteComponent } from 'src/app/vendor/delete/delete.component';
import { MatDialog } from '@angular/material/dialog';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'SOW_JD_BGSW_2023_402',
    children: [
      {
        name: 'RFQ - Technical Evaluation',
        children: [{ name: 'vendor name 1' }, { name: 'vendor name 2' }],
      },
      {
        name: 'Technical Proposal',
        children: [{ name: 'sample 1' }, { name: 'sample 2' }],
      },
      {
        name: 'SRN',
        children: [{ name: 'srn 1' }, { name: 'srn 2' }, { name: 'srn 3' }],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
@Component({
  selector: 'lib-rfqform',
  templateUrl: './rfqform.component.html',
  styleUrls: ['./rfqform.component.scss'],
})
export class RfqformComponent implements OnInit {
  // public showLoading = true;
  public dialogConfig: any;
  proposalDocuments: any = [];
  resource_list: any[] = [];
  equivalantCapacity: number = 0;
  equivalantpmo: number = 0;
  equivalantCost: number = 0;
  private gridApi__files!: GridApi;
  public rfq_Detail: any[] = [];
  form!: FormGroup;
  // FeedBack!: FormGroup;
  public techquestions: any = [];
  public saveRFQDetails: any;
  vendorDetails: any = [];
  public SOWJDID: any;
  questionsAndRatings: any;
  public rating!: number;
  checked: boolean = false;
  vendorName: any;
  vendorSPAID: any;
  isRFQSumbitted: boolean = false;
  sowJdStatusDetails: any = [];
  areAnyRecords: boolean = true;
  @Input() sowjd: string = '';
  @Input() rfqId: string = '';
  @Input() technicalEvloutionID: string = '';
  loader: boolean;
  rfqTechEvaNotGenerated: boolean = false;
  technicalEvaluation: any = [];
  displayedColumns = ['questions', 'rating'];
  public TechicalEvaluations: TechicalEvaluations = new TechicalEvaluations();
  public TechicalQuestions: TechicalQuestions = new TechicalQuestions();
  public TechnicalRating: any = [
    { rating: 1 },
    { rating: 2 },
    { rating: 3 },
    { rating: 4 },
    { rating: 5 },
    { rating: 6 },
    { rating: 7 },
    { rating: 8 },
    { rating: 9 },
    { rating: 10 },
    { rating: 'NA' },
  ];
  columnDefs: ColDef[] = [
    { field: 'no' },
    { field: 'skillset' },
    { field: 'grade' },
    { field: 'quantity' },
    { field: 'duration' },
    { field: 'pmo' },
    { field: 'cost' },
    { field: 'price' },
  ];
  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: false,
    filter: true,
    menuTabs: ['filterMenuTab'],
  };

  rowData = [
    {
      no: 1,
      skillset: 'Frontend development',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
    {
      no: 2,
      skillset: 'Backend development',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
    {
      no: 3,
      skillset: 'DevOps',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
    {
      no: 4,
      skillset: 'Frontend development',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
    {
      no: 5,
      skillset: 'Backend development',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
    {
      no: 6,
      skillset: 'DevOps',
      grade: 'L52',
      quantity: 100,
      duration: 30,
      pmo: 'auto',
      cost: 'auto',
      price: 'auto',
    },
  ];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  ngOnChanges(changes: SimpleChanges) {
    if (changes.rfqId) {
      this.ngOnInit();
    }
  }

  constructor(
    private createsowjdformservice: sowjdService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private notifyservice: NotifyService,
    private router: Router,
    private homeService: HomeService,
    private dialog: MatDialog
  ) {
    this.dataSource.data = TREE_DATA;
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {
    if (this.rfqId && this.technicalEvloutionID) {
      this.getVendorDetailOnRfqId();
      this.getTechnicalEvaluationRatings();
      this.form = this._formBuilder.group({
        arrayForm: this._formBuilder.array(
          this.techquestions.map((r: any) => this._formBuilder.group(r))
        ),
      });
    } else {
      this.rfqTechEvaNotGenerated = true;
    }
  }
  public sowjdFiles: any[] = [];
  uploadFile(event: any) {
    var file = event.target.files[0];
    this.sowjdFiles.push(file);
  }

  getTechRating(sowjdFiles: any) {
    this.createsowjdformservice
      .getTechRating(sowjdFiles)
      .subscribe((res: any) => {
        if (res.data.sowjdRfqDetails.length > 0) {
          this.techquestions = res.data.sowjdRfqDetails;
          this.techquestions = this.techquestions[0]?.questionsAndRatings;

          this.areAnyRecords = true;
        } else {
          this.areAnyRecords = false;
        }
      });
  }

  getTechnicalEvaluationRatings() {
    this.createsowjdformservice
      .getRFQQuestionsRatingDetails(this.technicalEvloutionID)
      .subscribe((res: any) => {
        this.technicalEvaluation = res.data;
        this.checked = this.technicalEvaluation.initiateTechnicalProposal;
      });
  }

  getVendorDetailOnRfqId() {
    this.createsowjdformservice
      .getVendorDetailOnRfqId(this.rfqId)
      .subscribe((res: any) => {
        this.vendorDetails = res.data;
      });
  }

  onRadioQuestions(event: any, item: any) {
    item.rating = event.value;
  }

  proposal_file_columnDefs = [
    { field: 'isd', headerName: 'File ID', sortable: false, filter: true },
    {
      field: 'fileName',
      headerName: 'File Name',
      sortable: false,
      filter: true,
      resizable: false,
      cellRenderer: DocURLComponent,
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      sortable: false,
      filter: true,
      resizable: false,
    },
  ];

  // write a service
  getProposalDocuments(rfqId: any) {
    this.createsowjdformservice
      .getProposalDocuments(rfqId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.proposalDocuments = response;
        }
      });
  }

  onGridReady__files(params: GridReadyEvent) {
    this.gridApi__files = params.api;
  }

  public columnDefsResource = [
    {
      headerName: 'Skillset',
      editable: false,
      hide: false,
      field: 'skillSetName',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'Grade',
      editable: false,
      hide: false,
      field: 'gradeName',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'Quantity',
      editable: false,
      hide: false,
      field: 'quantity',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'Duration(Months)',
      editable: false,
      hide: false,
      field: 'duration',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'PMO',
      editable: false,
      hide: false,
      field: 'pmo',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'Cost',
      editable: false,
      hide: false,
      field: 'cost',
      sortable: true,
      resizable: false,
    },
    {
      headerName: 'Price',
      editable: false,
      hide: false,
      field: 'price',
      sortable: true,
      resizable: false,
    },
  ];
  private gridApi!: GridApi;

  onGridReady__resource(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
  }

  onproposalFileChanged(event: any) {
    let EventFile = event.target.files[0];
    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        rfqId: this.vendorDetails.rfqId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        remarks: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.createsowjdformservice
        .uploadProposalDocuments(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            // this.getProposalDocuments(this.rfqId);
            this.gridApi__files.setRowData(this.proposalDocuments);
          }
        });
    });
  }

  fileData: any[] = [];
  onFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      var newfile = true;
      if (newfile) {
        this.vendorDetails.files.push({
          id: this.fileData.length + 1,
          fileID: this.fileData.length + 1,
          fileName: selectedFile.name,
          remarks: '',
          file: selectedFile,
        });
      }
    }
    // this.gridApi_srn_files.setRowData(this.srnDetail.files);
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  get projectInfo(): FormGroup {
    return this.form.get('projInfo') as FormGroup;
  }
  get departmentDetails(): FormGroup {
    return this.form.get('deptDetails') as FormGroup;
  }
  get purchaseOrder(): FormGroup {
    return this.form.get('PO') as FormGroup;
  }
  get costSkillsetVendors(): FormGroup {
    return this.form.get('costskillset') as FormGroup;
  }
  changeValue(value: boolean) {
    this.checked = !value;
  }
  RFQID: any;

  techEvaluationSaveSubmit(technicalEvaluationObj: any) {
    this.createsowjdformservice
      .saveRfqtechEvaluation(technicalEvaluationObj)
      .subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.notifyservice.alert(response.data.message);
            this.getTechnicalEvaluationRatings();
          }
        },
        (error) => {
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
  }

  popMessage(title: string, message: string) {
    this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
  }

  SaveForm(type: string) {
    let technicalEvolutionRatings: any = [];
    this.technicalEvaluation.technicalEvaluationRatings.forEach(
      (questions: any) => {
        technicalEvolutionRatings.push({
          questionId: questions.id,
          remarks: questions.remarks,
          rating: questions.rating ? questions.rating : 0,
        });
      }
    );

    let technicalEvaluationObj = {
      technicalEvaluationId: this.technicalEvloutionID,
      initiateTechnicalProposal: this.checked,
      technicalEvaluationStatusId: type === 'save' ? 2 : 3, //2 -save, 3-submit
      technicalEvolutionQuestions: technicalEvolutionRatings,
    };

    const ratingsCount = technicalEvolutionRatings.filter((element: any) => {
      if (element.rating !== 0) {
        return true;
      }
      return false;
    }).length;

    if (
      ratingsCount !==
      this.technicalEvaluation.technicalEvaluationRatings.length
    ) {
      this.popMessage('Ratings Check', 'Please rate all of them');
      return;
    }

    if (type === 'submit') {
      let dialogRef = this.dialog.open(DeleteComponent, {
        width: '30vw',
        data: { type: 'submit' },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res?.data !== null && res?.data === 'yes') {
          this.techEvaluationSaveSubmit(technicalEvaluationObj);
        }
      });
    }
    if (type === 'save') {
      this.techEvaluationSaveSubmit(technicalEvaluationObj);
    } else if (type == 'send_back') {
      this.RFQID = localStorage.getItem('RFQID');
      const Send_Back: any = {
        rfqId: this.RFQID,
      };

      this.createsowjdformservice.postRfqSendBackForm(Send_Back).subscribe({
        next: (v) => {
          this.notifyservice.alert('Sent Back Successful');
        },
        error: (e) => {
          this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {
          this.router.navigate(['/dm/']);
        },
      });
    }
  }
}
class TechicalQuestions {
  questionId: number = 0;
  remarks: string = '';
  rating: number = 0;
}
class TechicalEvaluations {
  sowJdId: string = '93408852-cf4d-458d-8507-409b0e81d24c';
  rfqId: string = 'b45225dd-364b-4de9-bd30-7fdc4eceab01';
  vendorId: number = 97259048;
  ntid: string = 'vld1hc';
  status: number = 0;
  technicalEvolutionQuestions: any = [];
}
