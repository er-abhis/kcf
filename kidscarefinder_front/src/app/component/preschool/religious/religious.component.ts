import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  EventEmitter,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { VERSION } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface Bank {
  id: string;
  name: string;
}
@Component({
  selector: 'app-religious',
  templateUrl: './religious.component.html',
  styleUrls: ['./religious.component.scss'],
})
export class ReligiousComponent implements OnInit {

  placeholder: any = "";
  label: any = "";
  error: any = "";

  version = VERSION;
  firstFormGroup: any;
  onSubmitSelection = new EventEmitter();
  submitSelection(): void {
    this.onSubmitSelection.emit(this.firstFormGroup.value.bankCtrl);
    this.dialog.closeAll();
  }
  /** control for the selected bank */
  // public bankCtrl: FormControl = new FormControl();

  //  /** control for the MatSelect filter keyword */
  // public bankFilterCtrl: FormControl = new FormControl();

  /** control for the selected bank for multi-selection */
  // public bankMultiCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword multi-selection */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  banks: any = [];
  matTitle: any = '';

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);

  /** list of banks filtered by search keyword for multi-selection */
  public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(
    1
  );

  @ViewChild('singleSelect')
  singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();
  public options: any = [];
  public optionStore: any = [];
  // bankFilterCtrl: any
  constructor(
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.options = this.data.selectArray;
    this.optionStore = this.data.selectArray;
    this.placeholder = this.data.placeholder;
    this.label = this.data.label;
    this.error = this.data.error;
    this.banks = this.data.selectArray;
    this.matTitle = this.data.MatTitle;

    this.firstFormGroup = this._formBuilder.group({
      bankCtrl: [[], Validators.required],
      // bankFilterCtrl: [''],
    });

    // this.firstFormGroup.setValue({
    //   bankCtrl: [this.banks[1]],
    //   // bankFilterCtrl: this.firstFormGroup
    //   //   .get('bankFilterCtrl')
    //   //   .valueChanges.pipe(takeUntil(this._onDestroy))
    //   //   .subscribe(() => {
    //   //     this.filterBanks();
    //   //   }),
    // });

    this.firstFormGroup.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });

    // load the initial bank list
    this.filteredBanks.next(this.banks);
    this.filteredBanksMulti.next(this.banks.slice());
  }

  ngAfterViewInit() {
    // this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredBanks
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: Bank, b: Bank) => a.id === b.id;
      });
  }

  private filterBanks() {
    if (!this.banks) {
      return;
    }

    let search: any = this.firstFormGroup.value.bankFilterCtrl;
    if (!search) {
      this.filteredBanks.next(this.banks.slice());
      return;
    } else {
      search = search.toString().toLowerCase();
    }
    // filter the banks
    this.filteredBanks.next(
      this.banks.filter(
        (bank: { name: { toString: () => string } }) =>
          bank.name.toString().toLowerCase().indexOf(search) > -1
      )
    );
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
      search = search.toString().toLowerCase();
    }
    // filter the banks
    this.filteredBanksMulti.next(
      this.banks.filter(
        (bank: { name: { toString: () => string } }) =>
          bank.name.toString().toLowerCase().indexOf(search) > -1
      )
    );
  }

  onSubmit() {
    this.dialog.closeAll();
  }

  cancleModal() {
    this.dialog.closeAll();
  }

  // For search provider
  search(event: any) {
    let searchData = event.target.value;

    if (searchData && searchData.trim())
      this.options = this.optionStore.filter((x: any) => x.name.toLowerCase().match(searchData.toLowerCase()));
    else
      this.options = this.optionStore;
  }
}
