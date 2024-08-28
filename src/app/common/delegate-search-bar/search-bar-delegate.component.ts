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
  selector: 'app-delegate-search-bar',
  templateUrl: './search-bar-delegate.component.html',
  styleUrls: ['./search-bar-delegate.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DelegateSearchBarComponent implements OnInit, OnDestroy {
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
  @Input() searchPlaceholderId: string = '';
  @Input() isRequired: boolean = false;
  @Output() selectionChangeEvent = new EventEmitter<any>();
  @Output() selectSearchValue = new EventEmitter<any>();
  @Output() resetEmitter = new EventEmitter<any>();
  noMatchFound: string = 'No matching results found';
  searchString: string = 'Search here';
  public searchBarControl!: FormControl;
  public searchFilterCtrl!: FormControl;
  protected _onDestroy = new Subject<void>();
  search = new Subject<string>();
  searchResponse: Observable<any>;

  constructor(
    private sowjdService: sowjdService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.getIntialUserData();
  }

  getOnSearch() {
    this.search.next('');
  }

  getIntialUserData() {
    this.searchResponse = this.search.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.loaderService.setShowLoading();
        return this.sowjdService.getIntialUserList(query).pipe(
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

    // this.sowjdService.getIntialUserList(searchValue).subscribe((res: any) => {
    //   console.log(res);
    //   this.dropdownValues = res.data;
    //   this.filtereValues.next(this.dropdownValues);
    // });
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
