import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import {
  Observable,
  ReplaySubject,
  Subject,
  map,
  startWith,
  take,
  takeUntil,
} from 'rxjs';
import { PlaningService } from '../../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect } from '@angular/material/select';
import { LoaderService } from 'src/app/services/loader.service';
interface Bank {
  id: string;
  name: string;
}
@Component({
  selector: 'app-create-flp',
  templateUrl: './create-flp.component.html',
  styleUrls: ['./create-flp.component.css'],
})
export class CreateFLPComponent {
  myForm!: FormGroup;
  receivedData: any;
  SectionList: any = [];
  fileData!: string;
  EventFile: any;
  base64Output: any;
  File: any = [];
  FileRowdata: any;
  filteredMSBE: string[] = ['MSBE1', 'MSBE2', 'MSBE3', 'MSBE4'];
  selectedMSBE: string[] = [];
  selectedOrgLevel: string = '';
  toppingList: any = [];
  private gridApi!: GridApi;
  orgLevelSelect: any;
  selectedSection: any = 'All';
  planningOrgLevel: any = 'All';
  toppings = new FormControl();
  searchUnit = '';
  selectedBU: any = 'All';
  filteredData = [];
  public enableUnit: boolean = true;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  // **********************
  @ViewChild('search') searchTextBox: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
  public data1: any = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  filteredOptions: Observable<any[]>;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  //Dropdown with search
  providers = new FormControl();
  allProviders: any[] = [];
  filteredProviders: any[] = [];
  //Multi Select search
  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** list of banks */
  private banks: Bank[] = [
    { name: 'Bank A (Switzerland)', id: 'A' },
    { name: 'Bank B (Switzerland)', id: 'B' },
    { name: 'Bank C (France)', id: 'C' },
    { name: 'Bank D (France)', id: 'D' },
    { name: 'Bank E (France)', id: 'E' },
    { name: 'Bank F (Italy)', id: 'F' },
    { name: 'Bank G (Italy)', id: 'G' },
    { name: 'Bank H (Italy)', id: 'H' },
    { name: 'Bank I (Italy)', id: 'I' },
    { name: 'Bank J (Italy)', id: 'J' },
    { name: 'Bank K (Italy)', id: 'K' },
    { name: 'Bank L (Germany)', id: 'L' },
    { name: 'Bank M (Germany)', id: 'M' },
    { name: 'Bank N (Germany)', id: 'N' },
    { name: 'Bank O (Germany)', id: 'O' },
    { name: 'Bank P (Germany)', id: 'P' },
    { name: 'Bank Q (Germany)', id: 'Q' },
    { name: 'Bank R (Germany)', id: 'R' },
  ];

  /** list of banks filtered by search keyword */

  /** list of banks filtered by search keyword for multi-selection */
  public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(
    1
  );

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  constructor(
    public dialogRef: MatDialogRef<CreateFLPComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private planningService: PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService
  ) {}
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.receivedData = this.data.message;
    this.companyCurrencyName = this.data.message.currency;
    let currencyObj = this.loaderService.getCountryDetailByCurrency(
      this.companyCurrencyName
    );
    this.companyLocale = currencyObj.locale;
    this.companyNumericFormat = currencyObj.numericFormat;
    this.myForm = this.makeForm();
    this.myForm.get('Ids')?.disable();
    // load the initial bank list
    this.filteredBanksMulti.next(this.banks.slice());

    // listen for search field value changes

    this.bankMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.banks.filter((bank) => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  space(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit() {
    this.loaderService.setShowLoading();
    const CreateAOP: any = {
      ...this.myForm.value,
    };
    CreateAOP['aopId'] = this.receivedData.id;
    CreateAOP['CFYearId'] = this.receivedData.cfCycleYear;
    CreateAOP['CompanyCode'] = this.receivedData.companyCode;
    this.planningService.CreateFLOP(CreateAOP).subscribe({
      next: (response: any) => {
        if (
          response?.status?.startsWith('Error') ||
          response?.status?.startsWith(' Error!!')
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = response.status;
          this.showErroMessage = true;
          return;
        }
        if (
          response.data === 'Record added success.' ||
          response.data === 'Record updated successfully.' ||
          response.data === 'Record added successfully' ||
          response.status === 'success'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar('First Level Planning Created Successfully');
          this.onClose(event);
        } else {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(response.data);
        }
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {},
    });
  }
  makeForm() {
    return this.formBuilder.group({
      PlanningOrgLevel: ['', Validators.required],
      Ids: [[], Validators.required],
      Remark: ['', Validators.required],
    });
  }
  uploadFile(event: any) {
    this.EventFile = event.target.files[0];
    this.convertFile(this.EventFile).subscribe((base64: any) => {
      this.base64Output = base64;
      this.EventFile['documentContent'] = this.base64Output;
      this.EventFile['documentName'] = this.EventFile.name;
      this.File.push(this.EventFile);
      this.FileRowdata = this.File;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  filterorgLevel(event: any) {
    this.selectedBU = event.value;
    this.SectionList = [];
    this.selectedSection = 'All';
    this.myForm.get('Ids')?.enable();
    this.myForm.get('Ids')?.reset();
    if (this.selectedBU == 'All') {
    } else {
      this.loaderService.setShowLoading();
      this.planningService
        .getFiltersBU(this.selectedBU, this.receivedData.companyCode)
        .subscribe({
          next: (res: any) => {
            this.SectionList = res.data;
            this.allProviders = res.data;
            this.filteredProviders = this.allProviders;
            this.loaderService.setDisableLoading();
          },
          error: (e: any) => {
            this.loaderService.setDisableLoading();
          },
        });
    }
  }

  onSearchUnit(event: any) {
    if (event.data != null) {
      this.filteredData = this.SectionList.filter((row: any) =>
        Object.values(row).some((value: any) => {
          if (
            value !== null &&
            (typeof value === 'string' || typeof value === 'number')
          ) {
            const lowerCaseValue = String(value).toLowerCase();
            const lowerCaseSearchText = event.data.toLowerCase();
            return lowerCaseValue.includes(lowerCaseSearchText);
          }
          return false;
        })
      );
      this.SectionList = this.filteredData;
    } else if (event.data == null) {
      this.planningService
        .getFiltersBU(this.selectedBU, this.receivedData.companyCode)
        .subscribe({
          next: (res: any) => {
            this.SectionList = res.data;
            this.loaderService.setDisableLoading();
          },
          error: (e: any) => {
            this.loaderService.setDisableLoading();
          },
        });
    }
  }
  filterSection(event: any) {
    if (event.value == 'All') {
      // this.dynamicMatForm.get(field.name)?.setValue(field?.value);
      // this.myForm.controls.ids.setValue(this.SectionList);
    } else {
    }
  }

  //drpdown with search and multi-select
  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.filteredProviders = this.allProviders.filter(({ name }) => {
      const prov = name.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = '';
    this.filteredProviders = this.allProviders;
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  // **********************

  /**
   * Used to filter data based on search input
   */
  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.SectionList.filter(
      (option: any) => option.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredList;
  }

  /**
   * Remove from selected values based on uncheck
   */
  selectionChange(event: any) {
    // if (event.isUserInput && event.source.selected == false) {
    //   let index = this.selectedValues.indexOf(event.source.value);
    //   this.selectedValues.splice(index, 1)
    // }
  }

  openedChange(e: any) {
    // Set search textbox value as empty while opening selectbox
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value
   */
  clearSearch(event: any) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  setSelectedValues() {
    if (
      this.selectFormControl.value &&
      this.selectFormControl.value.length > 0
    ) {
      // this.selectFormControl.value.forEach((e:any) => {
      //   if (this.selectedValues.indexOf(e) == -1) {
      //     this.selectedValues.push(e);
      //   }
      // });
    }
  }
}
