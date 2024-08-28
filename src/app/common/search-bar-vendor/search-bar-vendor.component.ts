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
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

import { MatSelectChange } from '@angular/material/select';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-search-bar-vendor',
  templateUrl: './search-bar-vendor.component.html',
  styleUrls: ['./search-bar-vendor.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarVendorComponent implements OnInit, OnDestroy {
  @Input()
  set resetClicked(clicked: boolean) {
    if (clicked) {
      this.searchBarControl?.reset();
      this.resetEmitter.emit(false);
    }
  }
  @Input() labelValue: string = '';
  @Input() selectedId: any;
  @Input() searchPlaceholder: string = '';
  @Input() sowJdId: string;
  @Input() searchPlaceholderId: string = '';
  @Input() isRequired: boolean = false;
  @Output() selectionChangeEvent = new EventEmitter<any>();
  @Output() selectSearchValue = new EventEmitter<any>();
  @Output() resetEmitter = new EventEmitter<any>();
  noMatchFound: string = 'No matching results found';
  searchString: string = 'Search here';
  public searchBarControl: FormControl = new FormControl();
  public searchFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  search = new Subject<string>();
  searchResponse: Observable<any>;

  constructor(
    private createsowjdformservice: sowjdService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getIntialVendor();
  }

  getOnSearch() {
    this.search.next('');
  }

  getIntialVendor() {
    this.searchResponse = this.search.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.loaderService.setShowLoading();
        return this.createsowjdformservice
          .getVendorSuggestinsSkillIds(this.sowJdId, query)
          .pipe(
            map((res: any) => {
              this.loaderService.setDisableLoading();
              return res.data;
            }),
            catchError((err, caught) => {
              return EMPTY;
            })
          );
      })
    );
  }

  getSearchValue(e: any) {
    this.search.next(e.target.value);
  }

  clearSelection() {
    this.getOnSearch();
  }

  optionChange(change: MatSelectChange) {
    this.selectionChangeEvent.emit(change.value);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
