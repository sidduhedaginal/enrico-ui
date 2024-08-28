import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { WidthdrawComponent } from '../../popup/widthdraw/widthdraw.component';

@Component({
  selector: 'lib-srnform',
  templateUrl: './srnform.component.html',
  styleUrls: ['./srnform.component.css']
})
export class SrnformComponent implements OnInit {
  rpColumnDefs: ColDef[] = [

    { field: 'no' },
    { field: 'skillset' },
     { field: 'grade' },
     { field: 'quantity'},
     { field: 'duration', headerName : "Duration (Month)"},
     { field: 'pmo' },
    { field: 'cost' },
    { field: 'price'} 
    ];
    public rpDefaultColDef: ColDef = {

    sortable: true,

    filter: true,

    flex: 1,

    editable: true

    };

    rpRowData = [

    { no: 1, skillset: 'Frontend development', grade: 'L52' , quantity : 10, duration: 10, pmo : 'auto', cost: 'auto', price: 'auto' },

    { no: 2, skillset: 'Backend development', grade: 'L53' , quantity : 20, duration: 15, pmo : 'mobile', cost: 'auto', price: 'auto'  },

    { no: 3, skillset: 'DevOps', grade: 'L52' , quantity : 30, duration: 20, pmo : 'auto', cost: 'auto', price: 'auto'  },

    { no: 4, skillset: 'Frontend development', grade: 'L53' , quantity : 40, duration: 20, pmo : 'manual', cost: 'auto', price: 'auto'  },

    { no: 5, skillset: 'Backend development', grade: 'L54' , quantity : 40, duration: 30, pmo : 'auto', cost: 'auto', price: 'auto'  },

    { no: 6, skillset: 'DevOps', grade: 'L54' , quantity : 50, duration: 30, pmo : 'manual', cost: 'auto', price: 'auto'  },

    ];


    isRequestClicked =true;
    isActionsClicked = false;
    dropdownVisible = false;
    selectedValues: string[] = [];
    selectedValues1: string[] = [];
    selectedColumnNumber = 0;
    searchQuery = '';
    requestClassName = 'requestSelected';
    actionClassName = 'action';

    myVariable="";

    ngOnInit(): void {


    }

    requestButton()
    {


      this.isRequestClicked  = true;
      this.requestClassName = 'requestSelected';
      this.isActionsClicked = false;
      this.actionClassName = 'action';


    }
    actionButton()
    {
        this.isRequestClicked  = false;
        this.requestClassName = 'request';
        this.isActionsClicked = true;
        this.actionClassName = 'actionSelected';

    }

   // Each Column Definition results in one Column.
    public columnDefs: ColDef[] = [
      {headerName: "SOW/JD ID",editable:false,field:'sowjd',cellRenderer: this.sowLink,resizable: true ,minWidth: 200},
      { headerName:"Customer",editable:false, field: 'customer', sortable: true,resizable: false,maxWidth:115 },
      { headerName:"Customer Name" ,editable:false,field: 'customerName',resizable: true,maxWidth:115 },
      { headerName:"Type", editable:false,field: 'type',resizable: false,maxWidth:115  },
      { headerName: "Documents",editable:false,field:'sowjdid',cellRenderer:this.function,resizable: false,maxWidth:150},
      { headerName: "History",editable:false,field:'sowjdid',cellRenderer:this.function1,resizable: false,maxWidth:100},
      { headerName: "Status",editable:false,field:'currentprocess',resizable: true},
      { headerName: '',editable:false,colId:"action",field:'',cellRenderer: this.actionCellRenderer}
    ];
    public columnDefs1=[{ field: 'sowjd', hide: true },{ field: 'customer', hide: true },{ field: 'type', hide: true }];


    //rfqData
    public rfqColumnDefs: ColDef[] = [
      {headerName: "RFQ ID",editable:false,field:'rfqidName',cellRenderer: this.sowLink,resizable: true ,minWidth: 200},
      { headerName:"Vendor",editable:false, field: 'vendor', sortable: true,resizable: false,maxWidth:115  },
      { headerName:"Due Date", editable:false,field: 'dueDate',resizable: false,maxWidth:115  },
      { headerName: "Status",editable:false,field:'currentprocess',resizable: true},
      { headerName: '',editable:false,colId:"action",field:'',cellRenderer: this.actionCellRenderer1}
    ];

    get filteredOptions1() {


      return this.columnDefs1.filter(option => option.field.toLowerCase().indexOf(this.searchQuery.toLowerCase()) !== -1);
     }




    // DefaultColDef sets props common to all Columns
    public defaultColDef: ColDef = {
      sortable: true,
      filter: true,
      flex: 1,
      editable: true
    };
    public editType: 'fullRow' = 'fullRow';
    public gridOptions:GridOptions = {

    }
    // Data that gets displayed in the grid
    public rowData$!:Observable<any[]>;

    public rfqData:any=[

        {
          "rfqid":1,
          "rfqidName":"RFQ_JD_BGSW_2023_101",
          "vendor":"vendor1",
          "dueDate":"",
          "currentprocess":"Submitted"
        },
        {
          "rfqid":2,
          "rfqidName":"RFQ_JD_BGSW_2023_102",
          "vendor":"vendor2",
          "dueDate":"",
          "currentprocess":"Submitted"
        },
        {
          "rfqid":3,
          "rfqidName":"RFQ_JD_BGSW_2023_103",
          "vendor":"vendor3",
          "dueDate":"",
          "currentprocess":"Submitted"
        }

    ];


    public data:any=[
      {
        "sowjdid":1,
        "sowjd":"SOW_JD_BGSW_2023_401",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD Draft"
      },
      {
        "sowjdid":2,
        "sowjd":"SOW_JD_BGSW_2023_402",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD approved"
      },
      {
        "sowjdid":3,
        "sowjd":"SOW_JD_BGSW_2023_403",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD rejected"
      },
      {
        "sowjdid":4,
        "sowjd":"SOW_JD_BGSW_2023_404",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"RFQ-Techical Evaluation-No Submissions"
      },
      {
        "sowjdid":5,
        "sowjd":"SOW_JD_BGSW_2023_405",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"Completed"
      },
      {
        "sowjdid":6,
        "sowjd":"SOW_JD_BGSW_2023_406",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD Approval In-Progress"
      },

      {
        "sowjdid":7,
        "sowjd":"SOW_JD_BGSW_2023_407",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD Draft"
      },
      {
        "sowjdid":8,
        "sowjd":"SOW_JD_BGSW_2023_408",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD approved"
      },
      {
        "sowjdid":9,
        "sowjd":"SOW_JD_BGSW_2023_409",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD rejected"
      },
      {
        "sowjdid":10,
        "sowjd":"SOW_JD_BGSW_2023_410",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"RFQ-Techical Evaluation-No Submissions"
      },
      {
        "sowjdid":11,
        "sowjd":"SOW_JD_BGSW_2023_411",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"Completed"
      },
      {
        "sowjdid":12,
        "sowjd":"SOW_JD_BGSW_2023_412",
        "customer":"Bosch",
        "customerName":"",
        "type":"Rate Card",
        "currentprocess":"SOW JD Approval In-Progress"
      },
    ];



    // For accessing the Grid's API
    @ViewChild(AgGridAngular) agGrid!: AgGridAngular;



    constructor(private http: HttpClient,private dialog: MatDialog) {}



    // Example load data from server
    onGridReady(params: GridReadyEvent) {
    }

    private gridApi!: GridApi;
    public Gridtitle! : string;
    public routerdata : any = [];
    toggleDropdown() {
       this.toggle("");
      this.dropdownVisible = !this.dropdownVisible;
      if (!this.dropdownVisible) {
       }
    }

    toggleOption(event: any) {
      const value = event.target.value;
      if (event.target.checked) {
        this.selectedValues.push(value);
      } else {
        const index = this.selectedValues.indexOf(value);

      }
    }

    toggleOption1(event: any) {
      const value = event.target.value;
      if (event.target.checked) {


        this.selectedValues.push(value);

      } else {
        const index = this.selectedValues.indexOf(value);
        if (index !== -1) {
          this.selectedValues.splice(index, 1);
        }
      }
    }

    toggle(col:any) {

      let count = 0;
      for(var x=0;x<this.columnDefs.length;x++)
      {
        if(this.columnDefs[x].hide===true) count +=1;

        if (this.columnDefs[x].field == col)
        {
          if(this.columnDefs[x].hide===false)
          {
            this.columnDefs[x].hide = true;

           }
          else
          {
            this.columnDefs[x].hide = false;
          }

        }
      }
      this.selectedColumnNumber = count;

    }
  // Example of consuming Grid Event
    onCellClicked( params:any): void {
      // Handle click event for action cells

      if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;


      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
      if (action === "clone") {
        params.api.applyTransaction({
          add: [params.node.data]
        });
      }
      if (action === "withdraw") {

        params.api.applyTransaction({
          add: [params.node.data]

        });
      }

    }
    }
    openDialog() {
      const dialogRef = this.dialog.open(WidthdrawComponent,{
        width: '80vw',
        data:  {}
      });;

      dialogRef.afterClosed().subscribe((result: any) => {
      });
    }

    lookDocument(){
      alert("Hi");

    }

    lookHistory(){

    }
    // Example using Grid's API
    clearSelection(): void {
      this.agGrid.api.deselectAll();
    }
    function(params:any): string {
    return '<div class="icon-wrapper"><span (click)="lookDocument()" class="material-icons">folder</span></div>';
   }
    function1(params:any): string {
      return '<span><i class="material-icons" (click)="lookHistory()">history</i></span>'
    }

    sowLink(params:any){
     let eGui = document.createElement("a");
     eGui.href = "/sowjdform";
     eGui.innerHTML = params.value;
     return eGui
    }

    actionCellRenderer(params:any) {
      var currentRowData=params.data;
      var currentStatus=currentRowData.currentprocess;
      if(currentStatus=="SOW JD Draft"){
        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:blue">check</mat-icon> Submit </span>'+
        '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#cf2a27">cancel</mat-icon>Delete</span>';
      }
      else if(currentStatus=="SOW JD approved")
      {
        return '<span class="icon-text"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#ff9900">file_copy</mat-icon> Clone </span>'

      }
      else if(currentStatus=="SOW JD rejected"){
        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:blue">check</mat-icon> Submit </span>'+
        '<span (click)="lookDocument()"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#9f12fd ">delete</mat-icon>Withdraw</span>';
      }
      else if(currentStatus=="RFQ-Techical Evaluation-No Submissions"){
        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:blue">check</mat-icon> Submit </span>'+
        '<span (click)="lookDocument()"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#9f12fd" >delete</mat-icon>Withdraw</span>';
      }
      else if(currentStatus=="Completed"){
        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#ff9900">file_copy</mat-icon> Clone </span>'

      }
      else if(currentStatus=="SOW JD Approval In-Progress"){
        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#ff9900">file_copy</mat-icon> Clone </span>'

      }
    else{
    return '';
    }

    }



      actionCellRenderer1(params:any) {



        return '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:blue">check</mat-icon> Approve </span>'+
        '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#cf2a27 ">cancel</mat-icon>Reject</span>'+
        '<span><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#ff9900 ">perm_identity</mat-icon>Delegate</span>';



        }

}
