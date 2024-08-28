import {
  Component,
  EventEmitter,
  Input,
  Output,
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
import { SowjdDetailsService } from '../../services/sowjd-details.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-vendor-search-bar-skillset',
  templateUrl: './vendor-search-bar-skillset.component.html',
  styleUrls: ['./vendor-search-bar-skillset.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VendorSearchBarSkillsetComponent {
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
  @Input() id: string;
  @Input() flag: number;
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
    private sowjdDetailsService: SowjdDetailsService,
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
        if (this.flag === 1) {
          return this.sowjdDetailsService.getTpSkillsets(this.id, query).pipe(
            map((res: any) => {
              this.loaderService.setDisableLoading();
              return res.data;
            }),
            catchError((err, caught) => {
              return EMPTY;
            })
          );
        } else {
          return this.sowjdDetailsService.getRFQSkillsets(this.id, query).pipe(
            map((res: any) => {
              this.loaderService.setDisableLoading();
              return res.data;
            }),
            catchError((err, caught) => {
              return EMPTY;
            })
          );
        }
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
