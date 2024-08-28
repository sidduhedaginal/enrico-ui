import { Component } from "@angular/core";
import { IHeaderAngularComp } from "ag-grid-angular";
import { IHeaderParams } from "ag-grid-community";
// import { IHeaderParams } from "ag-grid/main";

//------------------------------------------------------------------------------
@Component({
  template: `
    <input class="headercheckbox" type="checkbox" [checked]="selectAll" (change)="onCheckboxClick()" />
  `
})
export class GridHeaderSelectComponent implements IHeaderAngularComp {
  refresh(params: IHeaderParams<any, any>): boolean {
    throw new Error("Method not implemented.");
  }
  public params: any;
  public selectAll: boolean = false;

  //------------------------------------------------------------------------------
  agInit(headerParams: IHeaderParams): void {
    // debugger
    // console.log(`Init HeaderComponent`);

    this.params = headerParams;

    var rowCount = this.params.api.getDisplayedRowCount();
    var lastGridIndex = rowCount - 1;
    var currentPage = 5
    var pageSize = this.params.api.paginationGetPageSize();
    var startPageIndex = currentPage * pageSize;
    var endPageIndex = (currentPage + 1) * pageSize - 1;

    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }

    //Count selected rows
    var cptSelected = 0;
    for (var i = startPageIndex; i <= endPageIndex; i++) {
      var rowNode = this.params.api.getDisplayedRowAtIndex(i);
      cptSelected += rowNode.selected ? 1 : 0;
    }

    //Check the checkbox if all the rows are selected
    var cptRows = endPageIndex + 1 - startPageIndex;
    this.selectAll = cptSelected && cptRows <= cptSelected;
  }


  //------------------------------------------------------------------------------
  public onCheckboxClick(): void {
    // console.log("onCheckboxClick()");

    var rowCount = this.params.api.getDisplayedRowCount();
    var lastGridIndex = rowCount - 1;
    var currentPage = this.params.api.paginationGetCurrentPage();
    var pageSize = this.params.api.paginationGetPageSize();
    var startPageIndex = currentPage * pageSize;
    var endPageIndex = (currentPage + 1) * pageSize - 1;

    if (endPageIndex > lastGridIndex) {
      endPageIndex = lastGridIndex;
    }

    this.selectAll = !this.selectAll;

    for (var i = startPageIndex; i <= endPageIndex; i++) {
      var rowNode = this.params.api.getDisplayedRowAtIndex(i);
      rowNode.setSelected(this.selectAll);
    }
  }
  //------------------------------------------------------------------------------
  ngOnDestroy() {
    // console.log(`Destroying HeaderComponent`);
  }
}
