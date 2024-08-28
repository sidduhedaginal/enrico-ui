import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-search-bar-costcenter',
  templateUrl: './search-bar-costcenter.component.html',
  styleUrls: ['./search-bar-costcenter.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarCostcenterComponent implements OnInit, OnDestroy {
  @Input()
  set resetClicked(clicked: boolean) {
    if (clicked) {
      this.loadDropdownValues();
      this.searchBarControl?.reset();
      this.resetEmitter.emit(false);
    }
  }
  @Input() labelValue: string = '';
  @Input() selectedId: any;
  @Input() searchPlaceholder: string = '';
  @Input() searchPlaceholderId: string = '';
  @Input() isRequired: boolean = false;
  @Output() selectionChangeEvent = new EventEmitter<any>();
  @Output() selectSearchValue = new EventEmitter<any>();
  @Output() resetEmitter = new EventEmitter<any>();
  noMatchFound: string = 'No matching results found';
  searchString: string = 'Search here';
  public searchBarControl: FormControl = new FormControl();
  public searchFilterCtrl: FormControl = new FormControl();
  public filtereValues: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filteredOptions: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  dropdownValues: any;
  sowjdid: any;

  constructor(
    private createsowjdformservice: sowjdService,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getIntialCostCenters();
  }

  getIntialCostCenters(searchValue?: string) {
    this.route.params.subscribe((params: Params) => {
      this.sowjdid = params['id'];
    });
    this.loaderService.setShowLoading();
    this.createsowjdformservice
      .getCostCenterList(this.sowjdid, searchValue)
      .subscribe(
        (groups: any) => {
          this.loaderService.setDisableLoading();
          this.dropdownValues = groups.data;
          this.filtereValues.next(this.dropdownValues);
          this.loadDropdownValues();
        },
        (error) => {
          this.loaderService.setDisableLoading();
        }
      );
  }

  getSearchValue(e: any) {
    this.getIntialCostCenters(e.target.value);
  }

  clearSelection() {
    this.getIntialCostCenters();
  }

  loadDropdownValues() {
    this.loaderService.setShowLoading();
    if (this.selectedId) {
      this.searchBarControl.setValue(this.selectedId);
      this.loaderService.setDisableLoading();
    } else {
      this.loaderService.setDisableLoading();
    }
    this.searchFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDropdown();
      });
  }

  optionChange(change: MatSelectChange) {
    this.selectionChangeEvent.emit(change.value);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterDropdown() {
    if (!this.dropdownValues) {
      return;
    }
    // get the search keyword
    let search = this.searchFilterCtrl.value;
    if (!search) {
      this.filtereValues.next(this.dropdownValues.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filtereValues.next(
      this.dropdownValues.filter(
        (value) =>
          value[this.searchPlaceholder]?.toLowerCase().indexOf(search) > -1
      )
    );
  }
}
