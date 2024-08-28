import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, ColumnApi, GridReadyEvent } from 'ag-grid-community';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { CancelformComponent } from '../../popup/cancelform/cancelform.component';
import { WidthdrawComponent } from '../../popup/widthdraw/widthdraw.component';
import { ActivatedRoute } from '@angular/router';
import { sowjdService } from '../../services/sowjdService.service';

interface FoodNode {
  name: string | null;
  children?: FoodNode[];
  isLocked: string;
  section?: string;
  rfqId?: string | undefined;
  technicalEvloutionID?: string | undefined;
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string | null;
  level: number;
  isLocked: string;
  section: string;
  rfqId: string | undefined;
  technicalEvloutionID: string | undefined;
}

@Component({
  selector: 'lib-sowjdlinkform',
  templateUrl: './sowjdlinkform.component.html',
  styleUrls: ['./sowjdlinkform.component.scss'],
})
export class SowjdlinkformComponent implements OnInit {
  sowhide: boolean = false;
  rfqdisplay: boolean = true;
  tedisplay: boolean = true;
  srndisplay: boolean = true;
  sowJdNumber: any;
  anyVendorsAvailable: boolean = true;
  rfqId: string;
  technicalEvloutionID: string;
  TREE_DATA: FoodNode[] = [];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.SOWJDID = params.get('id');
      this.getTechRating(this.SOWJDID);
    });
  }

  getTechRating(sowjdId: string) {
    this.createsowjdformservice.getTechRating(sowjdId).subscribe((res: any) => {
      this.RFQDetails = res.data;
      console.log(res);
      var RFQList: any[] = [];
      var RFQList_TP: any[] = [];
      if (res.data.sowjdRfqDetails.length > 0) {
        res.data.sowjdRfqDetails.forEach((element: any) => {
          RFQList.push({
            name: element.vendorName ? element.vendorName : 'Vendor',
            isLocked: 'lock_open',
            section: 'rfq',
            rfqId: element.rfqId,
            technicalEvloutionID: element.technicalEvloutionID,
          });
        });
      } else {
        RFQList.push({
          name: 'No RFQ Data',
          isLocked: 'lock_open',
          section: 'rfq',
          rfqId: '',
          technicalEvloutionID: '',
        });
      }

      if (res.data.technicalProposal.length != 0) {
        res.data.technicalProposal.forEach((element: any) => {
          RFQList_TP.push({
            name: element.vendorName ? element.vendorName : 'TechnicalProposal',
            isLocked: 'lock_open',
            section: 'isTP',
            rfqId: element.rfqId,
            technicalEvloutionID: element.technicalEvloutionID,
          });
        });
      } else {
        RFQList_TP.push({
          name: 'TechnicalProposal',
          isLocked: 'lock_open',
          section: 'isTP',
          rfqId: '',
          technicalEvloutionID: '',
        });
      }

      (this.TREE_DATA = [
        {
          name: 'SOWJD',
          isLocked: 'lock_open',
          children: [
            {
              name: this.sowJdNumber ? this.sowJdNumber : 'SOWJD',
              isLocked: 'lock_open',
              section: 'sowjd',
              rfqId: '',
              technicalEvloutionID: '',
            },
          ],
        },
        {
          name: 'RFQ - Technical Evaluation',
          isLocked: 'lock_open',
          children: RFQList,
        },

        {
          name: 'Technical Proposal',
          isLocked: 'lock_open',
          children: RFQList_TP,
        },
        {
          name: 'SRN',
          isLocked: 'lock_open',
          children: [
            {
              name: 'vendor name 1',
              isLocked: 'lock_open',
              children: [
                {
                  name: 'srn 1',
                  isLocked: 'lock_open',
                  section: 'srn',
                  rfqId: '',
                  technicalEvloutionID: '',
                },
                {
                  name: 'srn 2',
                  isLocked: 'lock',
                  section: 'srn',
                  rfqId: '',
                  technicalEvloutionID: '',
                },
              ],
              section: 'srn',
              rfqId: '',
              technicalEvloutionID: '',
            },
          ],
          section: 'srn',
          rfqId: '',
          technicalEvloutionID: '',
        },
      ]),
        (this.dataSource.data = this.TREE_DATA);
      this.activeNode = this.treeControl.dataNodes[1];
      this.tree.treeControl.expandAll();
    });
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      isLocked: node.isLocked,
      level: level,
      rfqId: node.rfqId,
      technicalEvloutionID: node.technicalEvloutionID,
      section: node.section ? node.section : '',
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
    private route: ActivatedRoute,
    private createsowjdformservice: sowjdService
  ) {
    this.dataSource.data = this.TREE_DATA;
  }
  navigateChildPage(node: any) {
    if (node.section == 'rfq') {
      this.sowhide = true;
      this.rfqdisplay = false;
      this.rfqId = node.rfqId;
      this.technicalEvloutionID = node.technicalEvloutionID;
      this.tedisplay = true;
      this.srndisplay = true;
    }
    if (node.section == 'isTP') {
      this.sowhide = true;
      this.rfqdisplay = true;
      this.tedisplay = false;
      this.srndisplay = true;
    }
    if (node.section == 'srn') {
      this.sowhide = true;
      this.rfqdisplay = true;
      this.tedisplay = true;
      this.srndisplay = false;
    }
    if (node.section == 'sowjd') {
      this.sowhide = false;
      this.rfqdisplay = true;
      this.tedisplay = true;
      this.srndisplay = true;
    }
  }
  navigateparentdPage(node: any) {
    if (node.level == 0) {
      this.sowhide = false;
      this.rfqdisplay = true;
      this.tedisplay = true;
      this.srndisplay = true;
    }
  }

  private gridApi!: GridApi;
  private gridColumnApi!: ColumnApi;

  private gridApi__Po__skillset!: GridApi;
  private gridColumnApi__Po__skillset!: ColumnApi;
  activeNode!: any;

  ngAfterViewInit() {
    setTimeout(() => {
      this.tree.treeControl.expandAll();
    }, 5000);
  }

  public sowjd = '';
  public rateCardType = 'Rate Card';
  public customerName = '';
  public currentprocess = '';
  public sowjdid = '';
  public customer = 'Bosch';
  public internal_resource_check_done: any = [];
  public currency: any = [];
  public description = '';
  treenodes!: any;
  SOWJDID: any;
  vendorDetails: any;
  RFQDetails: any;

  rowData = [
    { name: 'John' },
    { name: 'Jane' },
    { name: 'Bob' },
    { name: 'Alice' },
  ];

  gridOptions = {
    rowSelection: 'multiple',
  };

  columnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'DH',
      field: 'DH',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU HEAD',
      field: 'BU_HEAD',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section Head',
      field: 'Section_Head',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section SPOC',
      field: 'Section_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU SPOC',
      field: 'BU_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 1',
      field: 'Approval_1',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 2',
      field: 'Approval_2',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      field: '',
      editable: false,
      colId: 'action',
      cellRenderer: function () {
        return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons">edit</span><span class="material-icons">delete_outline</span></div>';
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  actionCellRenderer(params: any) {
    let eGui = document.createElement('div');
    let editingCells = params.api.getEditingCells();
    let isCurrentRowEditing = editingCells.some((cell: any) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    eGui.innerHTML = `
    <mat-icon> edit </mat-icon>
    <mat-icon> delete_outline </mat-icon>
    `;

    return eGui;
  }

  rowData__Po__skillset = [
    {
      no: '1',
      SkillSet: 'Cloud Development',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
    {
      no: '2',
      SkillSet: 'Backend development',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
    {
      no: '3',
      SkillSet: 'Frontend development ',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
  ];

  gridOptions__Po__skillset = {
    rowSelection: 'multiple',
  };

  columnDefs__Po__skillset = [
    { field: 'select', headerName: 'Select', checkboxSelection: true },

    {
      headerName: 'No',
      field: 'no',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'SkillSet',
      field: 'SkillSet',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Grade',
      field: 'Grade',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Quantity',
      field: 'Quantity',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Duration (Months)',
      field: 'duration_months',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'PMO',
      field: 'pmo',
      sortable: true,
      filter: true,
      editable: true,
    },
    { headerName: 'Personal Cost', field: 'Personal_Cost' },
    { headerName: 'OH Cost', field: 'OH_Cost' },
    { headerName: 'Total Cost', field: 'TotalCost' },
    {
      field: '',
      editable: false,
      colId: 'action',
      cellRenderer: function () {
        return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons">edit</span><span class="material-icons">delete_outline</span></div>';
      },
    },
  ];

  columnDefs__Po__skillset_extra = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'DH',
      field: 'DH',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU HEAD',
      field: 'BU_HEAD',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section Head',
      field: 'Section_Head',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section SPOC',
      field: 'Section_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU SPOC',
      field: 'BU_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 1',
      field: 'Approval_1',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 2',
      field: 'Approval_2',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      field: '',
      editable: false,
      colId: 'action',
      cellRenderer: function () {
        return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons">edit</span><span class="material-icons">delete_outline</span></div>';
      },
    },
  ];

  onGridReady__Po__skillset(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  actionCellRenderer__Po__skillset(params: any) {
    let eGui = document.createElement('div');
    let editingCells = params.api.getEditingCells();
    let isCurrentRowEditing = editingCells.some((cell: any) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    eGui.innerHTML = `
    <mat-icon> edit </mat-icon>
    <mat-icon> delete_outline </mat-icon>
    `;

    return eGui;
  }

  // third grid

  rowData__Po__vendor = [
    {
      no: '1',
      SkillSet: 'Cloud Development',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
    {
      no: '2',
      SkillSet: 'Backend development',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
    {
      no: '3',
      SkillSet: 'Frontend development ',
      Grade: 'L52',
      Quantity: '2',
      duration_months: '6',
      pmo: 'auto',
      Personal_Cost: 'auto',
      OH_Cost: 'auto',
      TotalCost: 'auto',
    },
  ];

  gridOptions__Po__vendor = {
    rowSelection: 'multiple',
  };

  columnDefs__Po__vendor = [
    { field: 'select', headerName: 'Select', checkboxSelection: true },

    {
      headerName: 'No',
      field: 'no',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'SkillSet',
      field: 'SkillSet',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Grade',
      field: 'Grade',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Quantity',
      field: 'Quantity',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'Duration (Months)',
      field: 'duration_months',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'PMO',
      field: 'pmo',
      sortable: true,
      filter: true,
      editable: true,
    },
    { headerName: 'Personal Cost', field: 'Personal_Cost' },
    { headerName: 'OH Cost', field: 'OH_Cost' },
    { headerName: 'Total Cost', field: 'TotalCost' },
    {
      field: '',
      editable: false,
      colId: 'action',
      cellRenderer: function () {
        return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons">edit</span><span class="material-icons">delete_outline</span></div>';
      },
    },
  ];

  columnDefs__Po____Po__vendorExtra = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: 'DH',
      field: 'DH',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU HEAD',
      field: 'BU_HEAD',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section Head',
      field: 'Section_Head',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Section SPOC',
      field: 'Section_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'BU SPOC',
      field: 'BU_SPOC',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 1',
      field: 'Approval_1',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      headerName: 'Approval 2',
      field: 'Approval_2',
      cellRenderer: function () {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        const label = document.createElement('label');
        label.appendChild(checkbox);
        return label;
      },
    },
    {
      field: '',
      editable: false,
      colId: 'action',
      cellRenderer: function () {
        return '<div class="icon-wrapper" (click)="lookDocument()"><span class="material-icons">edit</span><span class="material-icons">delete_outline</span></div>';
      },
    },
  ];

  onGridReady__Po__vendor(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  actionCellRenderer__Po__vendor(params: any) {
    let eGui = document.createElement('div');
    let editingCells = params.api.getEditingCells();
    let isCurrentRowEditing = editingCells.some((cell: any) => {
      return cell.rowIndex === params.node.rowIndex;
    });

    eGui.innerHTML = `
    <mat-icon> edit </mat-icon>
    <mat-icon> delete_outline </mat-icon>
    `;

    return eGui;
  }

  openPopup() {
    const dialogRef = this.dialog.open(CancelformComponent, {});

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
      } else {
      }
    });
  }

  openDialogwidthdraw() {
    const dialogRef = this.dialog.open(WidthdrawComponent, {
      width: '50vw',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
