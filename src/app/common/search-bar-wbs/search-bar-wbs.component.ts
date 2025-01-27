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
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-search-bar-wbs',
  templateUrl: './search-bar-wbs.component.html',
  styleUrls: ['./search-bar-wbs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarWbsComponent implements OnInit, OnDestroy {
  @Input()
  set resetClicked(clicked: boolean) {
    if (clicked) {
      this.getIntialWBSCodes();
      this.loadDropdownValues();
      this.searchBarControl?.reset();
      this.resetEmitter.emit(false);
    }
  }
  @Input() labelValue: string = '';
  @Input() selectedId: any;
  @Input() companyId: string;
  @Input() searchPlaceholder: string = '';
  @Input() searchPlaceholderId: string = '';
  @Input() isRequired: boolean;
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

  constructor(
    private createsowjdformservice: sowjdService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getIntialWBSCodes();
  }

  getIntialWBSCodes(searchValue?: string) {
    if (
      this.companyId &&
      this.companyId !== '00000000-0000-0000-0000-000000000000'
    ) {
      // this.loaderService.setShowLoading();
      this.createsowjdformservice
        .getWBSList(this.companyId, searchValue)
        .subscribe(
          (groups: any) => {
            // this.loaderService.setDisableLoading();
            this.dropdownValues = groups.data;
            this.filtereValues.next(this.dropdownValues);
            this.loadDropdownValues();
          },
          (error) => {
            // this.loaderService.setDisableLoading();
          }
        );
    }
  }

  clearSelection() {
    this.getIntialWBSCodes();
  }

  getSearchValue(e: any) {
    this.getIntialWBSCodes(e.target.value);
  }

  loadDropdownValues() {
    // this.loaderService.setShowLoading();
    if (this.selectedId) {
      this.searchBarControl.setValue(this.selectedId);
      // this.loaderService.setDisableLoading();
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
