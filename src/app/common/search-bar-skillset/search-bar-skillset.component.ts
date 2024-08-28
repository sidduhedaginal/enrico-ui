import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-search-bar-skillset',
  templateUrl: './search-bar-skillset.component.html',
  styleUrls: ['./search-bar-skillset.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarSkillsetComponent implements OnInit, OnDestroy {
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
    this.getIntialSkillset();
  }

  getOnSearch() {
    this.search.next('');
  }

  getIntialSkillset() {
    this.searchResponse = this.search.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query: string) => {
        this.loaderService.setShowLoading();
        return this.createsowjdformservice.getSkillsetList(query).pipe(
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
