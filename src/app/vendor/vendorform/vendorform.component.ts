import { Component, ViewChild, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import {
  GridApi,
  GridOptions,
  GridReadyEvent,
  DomLayoutType,
} from 'ag-grid-community';
import { Observable, ReplaySubject } from 'rxjs';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { SRNDetails } from '../models/SRNDetails';
import { ActivatedRoute, Router } from '@angular/router';
import { SowjdDetailsService } from '../services/sowjd-details.service';
import 'ag-grid-enterprise';
import { SuccessComponent } from '../success/success.component';
import { EditDeleteActionsComponent } from '../shared/edit-delete-actions/edit-delete-actions.component';
import { DeleteComponent } from '../delete/delete.component';
import { HomeService } from 'src/app/services/home.service';
import { DashboardService } from '../services/dashboard.service';
import { TpAddResourceComponent } from '../tp-add-resource/tp-add-resource.component';
import { DatefilterComponent } from '../shared/datefilter/datefilter.component';
import { config } from 'src/app/config';
import { VendorDetailsService } from '../services/vendor-details.service';
import { sowjdService } from '../../dm/services/sowjdService.service';
import { VendorService } from '../services/vendor.service';

interface FoodNode {
  id?: number;
  name: string;
  children?: FoodNode[];
  isLocked: string;
  isRFQ?: boolean;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isLocked: string;
  isRFQ: boolean;
}
@Component({
  selector: 'lib-vendorform',
  templateUrl: './vendorform.component.html',
  styleUrls: ['./vendorform.component.scss'],
})
export class VendorformComponent implements OnInit {
  sowjdid: any;
  //selectedSowjdId = localStorage.getItem("sowJdId");
  IsRFQID: boolean = true;
  actionForm!: FormGroup;
  srmName: string = '';
  name: string = '';
  file: any;
  rfq_Detail: any = [];
  skillset: any[] = [];
  vendorDetails: any = [];
  isSRNLocked: string = '';
  proposalDocuments: any = [];
  TechnicalProposalDocuments: any = [];
  rfqResourceProdileDocs: any = [];
  tpResourceProdileDocs: any = [];
  public domLayout: DomLayoutType = 'autoHeight';
  public dialogConfig: any;
  equivalantCapacity: number = 0;
  equivalantpmo: number = 0;
  equivalantCost: number = 0;
  equivalantPrice_tp: number = 0;
  equivalantpmo_tp: number = 0;
  equivalantCost_tp: number = 0;
  resource_list: any[] = [];
  resource_tp_list: any[] = [];
  rfqStatus: string = '';
  rfqdisabled: boolean = false;
  error_msg: string = '';
  loader: boolean;
  allSOWJDData: any = [];
  technicalProposalDetails: any = [];
  sowjdDocuments: any = [];
  purchaseOrder: any = [];
  signOffDetails: any[] = [];
  poLinkedDetails: any[] = [];
  vendorId: string;
  dateFormat: any = config.dateFormat;
  poDropdownValues: any = [];
  isVendorEligibleForSignOff: boolean = false;
  islinkthepo: boolean = false;
  poNumber: any;
  signoffcomment: any;
  poremarks: any;
  billMonths: any[] = [
    { SRNBillingPeriodId: 1, SRNBillingPeriodMonth: 'Jan' },
    { SRNBillingPeriodId: 2, SRNBillingPeriodMonth: 'Feb' },
  ];
  TREE_DATA: FoodNode[] = [
    // {
    //   name: this.selectedSowjdId ?? "",
    //   isLocked:'',
    //   children: [
    //     {
    //       id:1,
    //       name: 'RFQ ID',
    //       isLocked:'none',
    //     },
    //     // {
    //     //   name: 'SRN',
    //     //   isLocked:'keyboard_arrow_right',
    //     //   children: [
    //     //     {id:1,name: 'SRN_2023_401',isLocked:'lock_closed'},
    //     //     {id:2,name: 'SRN_2023_402',isLocked:'lock_open'},
    //     //     {id:3,name: 'SRN_2023_403',isLocked:'lock_open'},
    //     // ],
    //     // }
    //   ],
    // },
  ];
  srnDetail: any;
  srnDetails: SRNDetails[] = [
    {
      id: 1,
      name: 'SRN_2023_june_401',
      isLocked: 'lock_closed',
      sowjd: '12322',
      fromDate: '12/1/2022',
      toDate: '12/1/2022',
      purchaseOrder: 'order1',
      country: 'india',
      orderCurrency: 'inr',
      potype: 'type1',
      poValidityStart: '12/1/2022',
      poValidityEnd: '12/1/2022',
      dmName: 'Manager',
      dmEmail: 'xyz@gmail.com',
      vendorName: 'Vendor1',
      vendorID: '1233',
      vendorEmail: 'xyz@gmail.com',
      resourcePlan: [
        {
          id: 1,
          skillSet: 'Backend',
          grade: 'Grade 0',
          quantity: '2',
          noOfMonths: '3',
          pmo: '',
          cost: '4',
          price: '6',
        },
      ],
      equivalantCapacity: '123',
      rateCard: '456',
      equivalantPMO: '1222',
      totalCost: '72371',
      deliveryManagerRemarks: 'please verify all the details',
      billMonth: '',
      invoice: '',
      remarks: '',
      files: [],
    },
    {
      id: 2,
      name: 'SRN_june_2023_402',
      isLocked: 'lock_open',
      sowjd: '263',
      fromDate: '12/1/2025',
      toDate: '12/1/2027',
      purchaseOrder: 'order1',
      country: 'veitnam',
      orderCurrency: 'inr',
      potype: 'type1',
      poValidityStart: '12/1/2022',
      poValidityEnd: '12/1/2022',
      dmName: 'Manager',
      dmEmail: 'xyz@gmail.com',
      vendorName: 'Vendor1',
      vendorID: '1233',
      vendorEmail: 'xyz@gmail.com',
      resourcePlan: [
        {
          id: 1,
          skillSet: 'cloud',
          grade: 'Grade 0',
          quantity: '2',
          noOfMonths: '3',
          pmo: '',
          cost: '4',
          price: '6',
        },
        {
          id: 2,
          skillSet: 'Python',
          grade: 'Grade 1',
          quantity: '7',
          noOfMonths: '8',
          pmo: '',
          cost: '9',
          price: '77',
        },
      ],
      equivalantCapacity: '767',
      rateCard: '76766',
      equivalantPMO: '765',
      totalCost: '176',
      deliveryManagerRemarks: 'verify  details',
      billMonth: '',
      invoice: '',
      remarks: '',
      files: [],
    },
    {
      id: 3,
      name: 'SRN_2023_june_403',
      isLocked: 'lock_open',
      sowjd: '54',
      fromDate: '12/1/2028',
      toDate: '12/1/2022',
      purchaseOrder: 'order3',
      country: 'singapore',
      orderCurrency: 'inr',
      potype: 'type1',
      poValidityStart: '12/1/2055',
      poValidityEnd: '12/1/2076',
      dmName: 'Manager3',
      dmEmail: 'xyz@gmail.com',
      vendorName: 'Vendor3',
      vendorID: '1233',
      vendorEmail: 'xyz@gmail.com',
      resourcePlan: [
        {
          id: 1,
          skillSet: 'cloud',
          grade: 'Grade 0',
          quantity: '2',
          noOfMonths: '3',
          pmo: '',
          cost: '4',
          price: '6',
        },
        {
          id: 2,
          skillSet: 'Python',
          grade: 'Grade 1',
          quantity: '7',
          noOfMonths: '8',
          pmo: '',
          cost: '9',
          price: '77',
        },
        {
          id: 3,
          skillSet: 'Frontend',
          grade: 'Grade 1',
          quantity: '7',
          noOfMonths: '8',
          pmo: '',
          cost: '9',
          price: '77',
        },
      ],
      equivalantCapacity: '767',
      rateCard: '76766',
      equivalantPMO: '765',
      totalCost: '176',
      deliveryManagerRemarks: 'verify  details',
      billMonth: '',
      invoice: '',
      remarks: '',
      files: [],
    },
  ];

  listOfFiles: any[] = [];

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
  onproposalFileChanged(event: any) {
    let EventFile = event.target.files[0];
    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        rfqId: this.rfq_Detail.rfqId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        remarks: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.sowjdDetailsService
        .uploadProposalDocuments(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.getProposalDocuments();
          }
        });
    });
  }

  onProfileFileChanged(event: any) {
    let EventFile = event.target.files[0];
    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        rfqId: this.rfq_Detail.rfqId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.sowjdDetailsService
        .uploadRFQResourceProfileDoc(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.getrfqResourceProfileDocuments();
          }
        });
    });
  }

  onTPProfileFileChanged(event: any) {
    let EventFile = event.target.files[0];
    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        technicalProposalId: this.technicalProposalDetails.techProposalId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.sowjdDetailsService
        .uploadTPResourceProfileDoc(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.getTPResourceProfileDocuments();
          }
        });
    });
  }
  onTPVendorproposalFileChanged(event: any) {
    let EventFile = event.target.files[0];
    this.convertFile(EventFile).subscribe((base64) => {
      var input = {
        technicalProposalId: this.technicalProposalDetails.techProposalId,
        fileName: EventFile.name,
        fileContent: base64,
        fileUrl: '',
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.sowjdDetailsService
        .uploadTechnicalProposalDocuments(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.getTechnicalProposalDocuments();
          }
        });
    });
  }
  fileData: any[] = [];
  activeNode: any;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      isLocked: node.isLocked,
      level: level,
      isRFQ: node.isRFQ ? node.isRFQ : false,
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
  @ViewChild('tree') tree: any;

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  constructor(
    private dialog: MatDialog,
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vendorDetailsService: VendorDetailsService,
    private createsowjdformservice: sowjdService,
    private sowjdDetailsService: SowjdDetailsService,
    private homeService: HomeService,
    private fb: FormBuilder,
    private vendorService: VendorService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorId = this.vendorService.vendorId;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.sowjdid = params?.sowjdId;
      if (this.sowjdid != null) {
        this.sowjdDetailsService
          .getSOWJDDetailsById(this.sowjdid, this.vendorId)
          .subscribe((response: any) => {
            if (response?.data != null) {
              this.rfq_Detail = response?.data?.getRFQPODetails[0];
              this.rfqStatus = this.rfq_Detail.sowJdRfqStatus;
              //this.rfqStatus='RFQNew';
              this.rfqdisabled =
                this.rfqStatus == 'RFQNew' || this.rfqStatus == 'NotInterest'
                  ? true
                  : false;
              this.skillset = response?.data?.sowJdRequestSkillset;
              this.vendorDetails = response?.data?.vendorDetails[0];
              this.getSowjdDocuments();
              this.getProposalDocuments();
              this.getrfqResourceProfileDocuments();
              this.getResurces();
              this.getEligleForSignOff();
              this.TREE_DATA = [
                {
                  name: this.rfq_Detail.sowJdNumber ?? '',
                  isLocked: '',
                  children: [
                    {
                      id: 1,
                      name: this.rfq_Detail.sowJdRfqNumber
                        ? this.rfq_Detail.sowJdRfqNumber
                        : 'RFQ ID',
                      isLocked: 'none',
                      isRFQ: true,
                    },
                    {
                      name: 'SRN',
                      isLocked: 'keyboard_arrow_right',
                      children: [
                        {
                          id: 1,
                          name: 'SRN_2023_june_401',
                          isLocked: 'lock_closed',
                          isRFQ: false,
                        },
                        {
                          id: 2,
                          name: 'SRN_2023_june_402',
                          isLocked: 'lock_open',
                          isRFQ: false,
                        },
                        {
                          id: 3,
                          name: 'SRN_2023_june_403',
                          isLocked: 'lock_open',
                          isRFQ: false,
                        },
                      ],
                    },
                  ],
                },
              ];
              this.dataSource.data = this.TREE_DATA;
              this.activeNode = this.treeControl.dataNodes[1];
              this.tree.treeControl.expandAll();
            }
          });
        this.sowjdDetailsService
          .getAllSOWJDDetailsById(this.sowjdid)
          .subscribe((response: any) => {
            if (response?.data != null) {
              this.allSOWJDData = response.data;
            }
          });
        this.sowjdDetailsService
          .getTechnicalProposalDetailsBySOWJDId(this.sowjdid)
          .subscribe((response: any) => {
            if (response?.data != null) {
              this.technicalProposalDetails = response.data[0];
              this.getTechnicalProposalDocuments();
              this.getTPResurces();
              this.getTPResourceProfileDocuments();
              if (this.technicalProposalDetails.status == 3) {
                this.getPoDropdownValues();
                this.getSignOffDetails();
                this.getPoLinkedDetails();
              }
            }
          });
      }
    });

    this.actionForm = this.fb.group({
      signoffRemarks: ['', Validators.required],
      poNumber: ['', Validators.required],
      poremarks: ['', Validators.required],
    });
  }

  get actionFormControl() {
    return this.actionForm.controls;
  }

  getPoDropdownValues() {
    this.vendorDetailsService
      .getVendorDropdownValues()
      .subscribe((response: any) => {
        if (response.data != null) {
          this.poDropdownValues = response.data.purchaseHeaders;
        }
      });
  }
  getSignOffDetails() {
    this.sowjdDetailsService
      .getSignOffDetails(this.sowjdid)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.signOffDetails = response.data;
          if (this.signOffDetails.length > 2) {
            this.islinkthepo = true;
          } else {
            this.islinkthepo = false;
          }
        }
      });
  }
  getPoLinkedDetails() {
    this.sowjdDetailsService
      .getPoLinkedDetails(this.sowjdid)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.poLinkedDetails = response.data;
          console.log(this.poLinkedDetails);
        }
      });
  }
  getEligleForSignOff() {
    this.sowjdDetailsService
      .getEligibleForSignOff(this.rfq_Detail.rfqId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.isVendorEligibleForSignOff = response.data[0];
        }
      });
  }
  getSowjdDocuments() {
    this.dashboardService
      .getSOWJDDocuments(this.sowjdid)
      .subscribe((response: any) => {
        this.sowjdDocuments = response;
      });
  }
  getResurces() {
    this.sowjdDetailsService
      .getResource(this.rfq_Detail.rfqId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.resource_list = response.data;
          if (this.resource_list.length > 0) {
            this.equivalantCapacity = 0;
            this.equivalantCost = 0;
            this.equivalantpmo = 0;
            this.resource_list.forEach((resource) => {
              this.equivalantCapacity += resource.quantity;
              this.equivalantCost += resource.price;
              this.equivalantpmo += resource.pmo;
            });
          }
        }
      });
  }
  getProposalDocuments() {
    this.sowjdDetailsService
      .getProposalDocuments(this.rfq_Detail.rfqId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.proposalDocuments = response;
        }
      });
  }
  getrfqResourceProfileDocuments() {
    this.sowjdDetailsService
      .getRfqResourceProfileDocuments(this.rfq_Detail.rfqId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.rfqResourceProdileDocs = response;
        }
      });
  }
  getTechnicalProposalDocuments() {
    this.sowjdDetailsService
      .getTechicalProposalDocuments(
        this.technicalProposalDetails.techProposalId
      )
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.TechnicalProposalDocuments = response;
        }
      });
  }
  getTPResurces() {
    this.sowjdDetailsService
      .getTPResource(this.technicalProposalDetails.techProposalId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.resource_tp_list = response.data;
          if (this.resource_tp_list.length > 0) {
            this.equivalantPrice_tp = 0;
            this.equivalantCost_tp = 0;
            this.equivalantpmo_tp = 0;
            this.resource_tp_list.forEach((resource) => {
              this.equivalantPrice_tp += resource.price;
              this.equivalantCost_tp += resource.cost;
              this.equivalantpmo_tp += resource.pmo;
            });
          }
        }
      });
  }

  getTPResourceProfileDocuments() {
    this.sowjdDetailsService
      .getTPResourceProfileDocuments(
        this.technicalProposalDetails.techProposalId
      )
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.tpResourceProdileDocs = response;
        }
      });
  }
  columnDefs_skillset = [
    {
      field: 'skillsetName',
      headerName: 'Skillset Name',
      sortable: true,
      filter: true,
      resizable: false,
      minWidth: 300,
    },
    {
      field: 'grade',
      headerName: 'Grade Name',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      headerName: 'No. of Months',
      field: 'duration',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      field: 'pmo',
      headerName: 'PMO',
      sortable: true,
      filter: true,
      resizable: false,
    },
  ];
  ResourcePlan_columnDefs = [
    {
      field: 'no',
      headerName: 'No',
      sortable: true,
      filter: true,
      resizable: false,
      maxWidth: 50,
    },
    {
      field: 'skillSet',
      headerName: 'Skillset',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      headerName: 'No of Months',
      field: 'noOfMonths',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      field: 'pmo',
      headerName: 'PMO',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      sortable: true,
      filter: true,
      resizable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      filter: true,
      resizable: false,
    },
  ];
  public columnDefs_resource = [
    {
      headerName: 'Skillset Name',
      editable: false,
      hide: false,
      field: 'skillSetName',
      sortable: true,
      resizable: false,
      flex: 1,
      minWidth: 300,
    },
    {
      headerName: 'Grade Name',
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

  public columnDefs__resource = [
    {
      headerName: 'Skillset Name',
      editable: false,
      hide: false,
      field: 'skillSetName',
      sortable: true,
      resizable: false,
      flex: 1,
      minWidth: 300,
    },
    {
      headerName: 'Grade Name',
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
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      cellRendererParams: {
        // edit: (params: any) => {
        //   let dialogRef = this.dialog.open(
        //     AddResourceComponent,
        //     this.dialogConfig
        //   );
        //   let data = { isCreate: false, resource: params.data };
        //   let instance = dialogRef.componentInstance;
        //   instance.resourceInput = data;
        //   instance.rfqid = this.rfq_Detail.rfqId;
        //   dialogRef.afterClosed().subscribe((res) => {
        //     if (res.data != null) {
        //       this.getResurces();
        //       this.gridApi__resource.setRowData(this.resource_list);
        //     }
        //   });
        // },
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              let input = { id: params.data.id };
              this.sowjdDetailsService
                .deleteResource(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.getResurces();
                    this.gridApi__resource.setRowData(this.resource_list);
                  }
                });
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];

  public columnDefs_tp_resource = [
    {
      headerName: 'Skillset Name',
      editable: false,
      hide: false,
      field: 'skillSetName',
      sortable: true,
      resizable: false,
      minWidth: 300,
    },
    {
      headerName: 'Grade Name',
      editable: false,
      hide: false,
      field: 'gradeName',
      sortable: true,
      resizable: false,
    },
    // { headerName:"Quantity",editable:false,hide:false, field: 'quantity', sortable: true,resizable: false,maxWidth:115 },
    // { headerName:"Duration(Months)",editable:false,hide:false, field: 'duration', sortable: true,resizable: false,maxWidth:115 },
    {
      headerName: 'Resource Onboarding Date',
      editable: false,
      hide: false,
      field: 'resourceOnboardingDate',
      sortable: true,
      resizable: false,
      cellRenderer: DatefilterComponent,
    },
    {
      headerName: 'PMO',
      editable: false,
      hide: false,
      field: 'pmo',
      sortable: true,
      resizable: false,
      maxWidth: 100,
    },
    {
      headerName: 'Cost',
      editable: false,
      hide: false,
      field: 'cost',
      sortable: true,
      resizable: false,
      maxWidth: 100,
    },
    {
      headerName: 'Price',
      editable: false,
      hide: false,
      field: 'price',
      sortable: true,
      resizable: false,
      maxWidth: 100,
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      colId: 'action',
      field: '',
      cellRenderer: EditDeleteActionsComponent,
      maxWidth: 100,
      cellRendererParams: {
        edit: (params: any) => {
          let dialogRef = this.dialog.open(
            TpAddResourceComponent,
            this.dialogConfig
          );
          let data = { isCreate: false, resource: params.data };
          let instance = dialogRef.componentInstance;
          instance.resourceInput = data;
          instance.tpId = this.technicalProposalDetails.techProposalId;
          dialogRef.afterClosed().subscribe((res) => {
            if (res.data != null) {
              this.getTPResurces();
              this.gridApi_tp_resource.setRowData(this.resource_tp_list);
            }
          });
        },
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              let input = { id: params.data.id };
              this.sowjdDetailsService
                .deleteTPResource(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    this.getTPResurces();
                    this.gridApi_tp_resource.setRowData(this.resource_tp_list);
                  }
                });
            }
          });
        },
      },
      suppressMenu: true,
    },
  ];
  public columnDefs_tp_resource_submitted = [
    {
      headerName: 'Skillset Name',
      editable: false,
      hide: false,
      field: 'skillSetName',
      sortable: true,
      resizable: false,
      minWidth: 300,
    },
    {
      headerName: 'Grade Name',
      editable: false,
      hide: false,
      field: 'gradeName',
      sortable: true,
      resizable: false,
    },
    // { headerName:"Quantity",editable:false,hide:false, field: 'quantity', sortable: true,resizable: false,maxWidth:115 },
    // { headerName:"Duration(Months)",editable:false,hide:false, field: 'duration', sortable: true,resizable: false,maxWidth:115 },
    {
      headerName: 'Resource Onboarding Date',
      editable: false,
      hide: false,
      field: 'resourceOnboardingDate',
      sortable: true,
      resizable: false,
      cellRenderer: DatefilterComponent,
    },
    {
      headerName: 'PMO',
      editable: false,
      hide: false,
      field: 'pmo',
      sortable: true,
      resizable: false,
      maxWidth: 115,
    },
    {
      headerName: 'Cost',
      editable: false,
      hide: false,
      field: 'cost',
      sortable: true,
      resizable: false,
      maxWidth: 115,
    },
    {
      headerName: 'Price',
      editable: false,
      hide: false,
      field: 'price',
      sortable: true,
      resizable: false,
      maxWidth: 115,
    },
  ];
  public columnDefs_signoff = [
    {
      headerName: 'Name',
      hide: false,
      field: 'name',
    },
    {
      headerName: 'Email ID',
      hide: false,
      field: 'email',
      maxWidth: 450,
    },
    {
      headerName: 'Role',
      hide: false,
      field: 'role',
    },
    {
      headerName: 'Date & Time',
      hide: false,
      field: 'actionOn',
    },
    {
      headerName: 'Comment',
      hide: false,
      field: 'remarks',
    },
  ];
  public columnDefs_polinked = [
    {
      headerName: 'PO Number',
      hide: false,
      field: 'poNumber',
      minWidth: 250,
    },
    {
      headerName: 'Remarks',
      hide: false,
      field: 'poRemarks',
    },
  ];
  public defaultColDef: any = {
    sortable: true,
    filter: true,
    flex: 1,
    editable: true,
    menuTabs: ['filterMenuTab'],
  };

  public editType: 'fullRow' = 'fullRow';
  public gridOptions: GridOptions = {};
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi__resource!: GridApi;
  private gridApi_tp_resource!: GridApi;
  private gridApi_srn_files!: GridApi;
  private signoff!: GridApi;
  private polinked!: GridApi;
  public value = new Date();

  onGridReady__resource(params: GridReadyEvent) {
    this.gridApi__resource = params.api;
  }
  onGridReady_tp_resource(params: GridReadyEvent) {
    this.gridApi_tp_resource = params.api;
  }
  onGridReady_signoff(params: GridReadyEvent) {
    this.signoff = params.api;
  }
  onGridReady_polinked(params: GridReadyEvent) {
    this.polinked = params.api;
  }

  onGridReady_srn_files(params: GridReadyEvent) {
    this.gridApi_srn_files = params.api;
  }
  navigateChildPage(node: any) {
    console.log(node);
    if (node.isRFQ) {
      this.IsRFQID = true;
    } else {
      this.srmName = node.name;
      this.IsRFQID = false;
      this.isSRNLocked = node.isLocked;
      this.srnDetail = this.srnDetails.find((s: any) => s.name == node.name);
    }
  }
  ngAfterViewInit() {
    this.tree.treeControl.expandAll();
  }

  // openDialog() {
  //   let dialogRef = this.dialog.open(AddResourceComponent, this.dialogConfig);
  //   let data = { isCreate: true };
  //   let instance = dialogRef.componentInstance;
  //   instance.rfqid = this.rfq_Detail.rfqId;
  //   instance.resourceInput = data;
  //   dialogRef.afterClosed().subscribe((res) => {
  //     if (res.data != null) {
  //       this.getResurces();
  //       this.gridApi__resource.setRowData(this.resource_list);
  //     }
  //   });
  // }

  addTPResource() {
    let dialogRef = this.dialog.open(TpAddResourceComponent, this.dialogConfig);
    let data = { isCreate: true };
    let instance = dialogRef.componentInstance;
    instance.tpId = this.technicalProposalDetails.techProposalId;
    instance.resourceInput = data;
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data != null) {
        this.getTPResurces();
        this.gridApi_tp_resource.setRowData(this.resource_tp_list);
      }
    });
  }

  interestedorNot(isInterested: boolean) {
    let input = {
      isInterested: isInterested,
      sowJdId: this.rfq_Detail.sowJdId,
    };
    this.sowjdDetailsService
      .sowstatatusNotInterested(input)
      .subscribe((response: any) => {
        if (response.data != null) {
          if (response.data[0].isSuccess) {
            let dialogRef = this.dialog.open(
              SuccessComponent,
              this.dialogConfig
            );
            let message = response.data[0].message;
            let instance = dialogRef.componentInstance;
            instance.message = message;
            this.router.navigate(['vendor']);
          }
        }
      });
  }

  saveOrSubmit(isSubmitted: boolean) {
    this.error_msg = '';
    if (isSubmitted) {
      if (this.proposalDocuments.data.length == 0) {
        this.error_msg = 'Please add Proposal Document';
        return false;
      }
      if (this.resource_list.length == 0) {
        this.error_msg = 'Please add Resource';
        return false;
      }
      if (
        this.rfq_Detail.remarks?.trim() == '' ||
        this.rfq_Detail.remarks == null
      ) {
        this.error_msg = 'Please add Remarks';
        return false;
      }
    }
    let input = {
      sowJdId: this.rfq_Detail.sowJdId,
      rfqId: this.rfq_Detail.rfqId,
      remarks: this.rfq_Detail.remarks?.trim(),
      isSubmitted: isSubmitted,
    };
    this.sowjdDetailsService
      .sowstatatussaveOrSubmit(input)
      .subscribe((response: any) => {
        if (response.data != null) {
          if (response.data[0].isSuccess) {
            let dialogRef = this.dialog.open(
              SuccessComponent,
              this.dialogConfig
            );
            let message = response.data[0].message;
            let instance = dialogRef.componentInstance;
            instance.message = message;
            this.router.navigate(['vendor']);
          }
          if (!response.data[0].isSuccess) {
            let dialogRef = this.dialog.open(
              SuccessComponent,
              this.dialogConfig
            );
            let message = response.data[0].message;
            let instance = dialogRef.componentInstance;
            instance.message = message;
            this.router.navigate(['vendor']);
          }
          this.router.navigate(['vendor']);
        }
      });
    return true;
  }

  saveOrSubmitTp(isSubmitted: boolean) {
    this.error_msg = '';
    if (isSubmitted) {
      if (this.TechnicalProposalDocuments.data.length == 0) {
        this.error_msg = 'Please add Proposal Document';
        return false;
      }
      if (this.resource_tp_list.length == 0) {
        this.error_msg = 'Please add Resource';
        return false;
      }
      if (this.tpResourceProdileDocs.data.length == 0) {
        this.error_msg = 'Please add Resource Profiles';
        return false;
      }
      if (
        this.technicalProposalDetails.remarks?.trim() == '' ||
        this.technicalProposalDetails.remarks == null
      ) {
        this.error_msg = 'Please add Remarks';
        return false;
      }
    }
    let input = {
      sowJdId: this.sowjdid,
      technicalProposalId: this.technicalProposalDetails.techProposalId,
      remarks: this.technicalProposalDetails.remarks?.trim(),
      isSubmitted: isSubmitted,
    };
    this.sowjdDetailsService
      .TPsaveOrSubmit(input)
      .subscribe((response: any) => {
        if (response.data != null) {
          if (response.data[0].isSuccess) {
            let dialogRef = this.dialog.open(
              SuccessComponent,
              this.dialogConfig
            );
            let message = response.data[0].message;
            let instance = dialogRef.componentInstance;
            instance.message = message;
            this.router.navigate(['vendor']);
          }
          if (!response.data[0].isSuccess) {
            let dialogRef = this.dialog.open(
              SuccessComponent,
              this.dialogConfig
            );
            let message = response.data[0].message;
            let instance = dialogRef.componentInstance;
            instance.message = message;
            this.router.navigate(['vendor']);
          }
          this.router.navigate(['vendor']);
        }
      });
    return true;
  }
  deleteFile(id: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        let input = { id: id };
        this.sowjdDetailsService
          .deleteProposalDocuments(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = response.data[0].message;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getProposalDocuments();
            }
          });
      }
    });
  }

  deleterfqResourceProfileFile(id: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        let input = { id: id };
        this.sowjdDetailsService
          .deleterfqResourceProdileDoc(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = response.data[0].message;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getrfqResourceProfileDocuments();
            }
          });
      }
    });
  }

  deleteTPResourceProfileFile(id: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        let input = { id: id };
        this.sowjdDetailsService
          .deleteTPResourceProdileDoc(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = response.data[0].message;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getTPResourceProfileDocuments();
            }
          });
      }
    });
  }

  deleteTechnicalProposalDoc(id: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        let input = { id: id };
        this.sowjdDetailsService
          .deleteTechnicalProposalDoc(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = response.data[0].message;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getTechnicalProposalDocuments();
            }
          });
      }
    });
  }

  VendorSignOff() {
    this.actionForm.markAllAsTouched();
    if (!this.actionForm.valid) return;

    let input = {
      rfqId: this.rfq_Detail.rfqId,
      purchaseHeaderId: this.actionForm.value.poNumber,
      vendorId: this.vendorId,
      remarks: this.actionForm.value.signoffRemarks,
      poRemarks: this.actionForm.value.poremarks,
    };
    this.sowjdDetailsService.vendorSignOff(input).subscribe((response: any) => {
      if (response.data[0].isSuccess) {
        let dialogRef = this.dialog.open(SuccessComponent, this.dialogConfig);
        let message = response.data[0].message;
        let instance = dialogRef.componentInstance;
        instance.message = message;
        this.router.navigate(['vendor']);
      }
    });
  }

  linkThePo() {
    this.error_msg = '';
    if (
      this.poremarks != null &&
      this.poremarks != undefined &&
      this.poremarks != ''
    ) {
      let input = {
        technicalProposalId: this.technicalProposalDetails.techProposalId,
        purchaseHeadersId: this.poNumber,
        poRemarks: this.poremarks,
      };
      this.sowjdDetailsService.linkThePo(input).subscribe((response: any) => {
        if (response.data[0].isSuccess) {
          let dialogRef = this.dialog.open(SuccessComponent, this.dialogConfig);
          let message = response.data[0].message;
          let instance = dialogRef.componentInstance;
          instance.message = message;
          this.router.navigate(['vendor']);
        }
      });
      return true;
    } else {
      this.error_msg = 'Please Enter PO Remarks';
      return false;
    }
  }
}
