import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { ProviderService } from 'src/app/services/rest-services/provider.service';
import { CustomAlertMessage } from 'src/app/utills/constant/customAlertMessage';
import { NotificationService } from 'src/app/utills/notification.service';
import { ReplaySubject, Subject } from 'rxjs';
import { MAT_SELECT_CONFIG, MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-affiliations',
  templateUrl: './affiliations.component.html',
  styleUrls: ['./affiliations.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'affilationSelect' }
    }
  ]
})
export class AffiliationsComponent implements OnInit {
  stepCount: number = 0;
  selectedVal = 8;
  addedAffiliationsId: any = [];
  //filteredProvidersList: any = [];
  // filteredToppingListlanguage: any = [];
  affiliatedProviderData: any;
  filteredProvidersList: ReplaySubject<any> = new ReplaySubject(1);
  filteredToppingListlanguage: ReplaySubject<any> = new ReplaySubject(1);
  toppingsReligious: FormControl = new FormControl();
  religionMesg: boolean = false;
  languageMesg: boolean = false;
  @Input()
  set selectedIndex(value: number) {
    this.selectedVal = value;
  }
  get selectedIndex(): number {
    return this.selectedVal;
  }

  @Input()
  set stepCountNumber(value: any) {
    if (this.selectedVal == 8) {
      this.affiliatedProviderData = null;
      this.addaffiliationType = false;
      this.stepCount = + value;
      if (this.stepCount == 0) {
        this.getReligions();
        this.getAffiliation();
      }
      else if (this.stepCount == 1) {
        this.getLanguages();
        this.getAffiliation();
      }
      else if (this.stepCount == 2) {
        this.getAffiliation();
      }
      else if (this.stepCount == 3) {
        this.getAffiliation();
        this.getAffiliatedProvider();
      }
      else {
        this.getReligions();
        this.getLanguages();
        this.getAffiliatedProvider();
        this.getAffiliation();
      }

    }
  }

  get stepCountNumber(): number {
    return this.stepCount;
  }

  affliationGroup = this._formBuilder.group({
    religiousHave: [''],
    toppingsReligious: [''],
    providerMultiFilterCtrl: new FormControl()
  });

  ChildNeedCareGroup = this._formBuilder.group({
    langHave: [''],
    toppingslanguage: [''],
    providerLangFilterCtrl: new FormControl()
  });

  ChildNeedCareTK12 = this._formBuilder.group({
    tk12: [''],
  });

  ChildNeedCare = this._formBuilder.group({
    affiliatedProvider: [''],
  });
  constructor(
    private _formBuilder: FormBuilder,
    private providerService: ProviderService,
    private notificatioService: NotificationService
  ) { }

  // toppingsReligious = new FormControl([]);
  toppingListReligious: any = []
  //filteredProvidersList: any = [];
  // toppingslanguage = new FormControl('');
  toppingListlanguage: any = [];
  favoriteSeason: string | undefined;
  favoriteSeason1: string | undefined;
  ReligiousProYesNo: string[] = ['Yes', 'No'];
  PrivateSchoolYesNo: string[] = ['Yes', 'No'];
  LanguageOtherYesNo: string[] = ['Yes', 'No'];
  AffProTypeYesNo: string[] = ['Yes', 'No'];
  PrivateSchoolHaveDrop: boolean = false;
  LanguageOtherDrop: boolean = false;
  ReligiousHaveDrop: boolean = false;
  affliationType: boolean = false;
  addaffiliationType: boolean = false;
  affiliatedProvidersList: any = [];

  protected _onDestroy = new Subject();

  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;


  ngOnInit(): void {
  }

  ngOnDestroy() {
    this._onDestroy.complete();
  }

  searchValueLanguage() {
    this.languageMesg = false;
    if (!this.toppingListlanguage) {
      return;
    }

    let search = this.ChildNeedCareGroup.controls.providerLangFilterCtrl.value;
    if (!search) {
      this.filteredToppingListlanguage.next(this.toppingListlanguage.slice());
      return;
    }
    var check = this.toppingListlanguage.filter((item: any) => item.language.toLowerCase().indexOf(search.toLowerCase()) > -1)
    //  filter((x: any) => x.religion.toUpperCase().match(search.toUpperCase()));
    this.filteredToppingListlanguage.next(check);
    if (check.length == 0)
      this.languageMesg = true;
  }

  searchValueProvider() {
    this.religionMesg = false;
    if (!this.toppingListReligious) {
      return;
    }

    let search = this.affliationGroup.controls.providerMultiFilterCtrl.value;
    if (!search) {
      this.filteredProvidersList.next(this.toppingListReligious.slice());
      return;
    }
    var check = this.toppingListReligious.filter((item: any) => item.religion.toLowerCase().indexOf(search.toLowerCase()) > -1)
    //  filter((x: any) => x.religion.toUpperCase().match(search.toUpperCase()));
    this.filteredProvidersList.next(check);
    if (check.length == 0)
      this.religionMesg = true;
  }

  AffProTypeChange(event: MatRadioChange, data: any) {
    this.affliationType = data === 'Yes' ? true : false;
  }

  searchProvider() {
    this.providerService.searchAffiliatedprovider(this.affiliatedProviderData)
      .subscribe((response: any) => {
        if (response.data.length && response.data[0].id) {
          let ids = this.affiliatedProvidersList.map((item: any) => item.id)
          if (!ids.includes(response.data[0].id)) {
            this.affiliatedProvidersList.push(response.data[0])
            this.addaffiliationType = false;
            this.affiliatedProviderData = null;
          }
          else
            this.notificatioService.showError(CustomAlertMessage.affiliation[4].message)
        }
        else
          this.notificatioService.showError(CustomAlertMessage.affiliation[5].message)

      },
        (error) => {
          this.notificatioService.showError(CustomAlertMessage.affiliation[5].message)
        })
  }

  getAffiliatedProvider() {
    this.providerService.getAffiliatedprovider(localStorage.getItem('provider_id'))
      .subscribe({
        next: (res: any) => {
          res.data = res.data.map((item: any) => item.affiliated_provider);
          this.affiliatedProvidersList = res.data;
          this.addedAffiliationsId = this.affiliatedProvidersList.map((item: any) => item.id)
          if (this.affiliatedProvidersList.length && this.ChildNeedCare.value.affiliatedProvider == 'Yes') {
            this.affliationType = true;
          }
        },
        error: (error: any) => {
        }
      })
  }

  deleteAffiliatedProvider(id?: any) {
    if (id) {
      this.providerService.delAffiliatedprovider(localStorage.getItem('provider_id'), id)
        .subscribe({
          next: (res: any) => {

          },
          error: (error: any) => {
            this.notificatioService.showError('Some error occured')
          }
        })
    }
    let ids = this.affiliatedProvidersList.map((item: any) => item.id)
    if (ids.indexOf(id) != -1) {
      this.affiliatedProvidersList.splice(ids.indexOf(id), 1);
    }
  }

  saveData() {
    if (this.affiliatedProviderData.trim())
      this.searchProvider();
  }

  LanguageOtherChange(event: MatRadioChange, data: any) {

    if (data === 'Yes') this.LanguageOtherDrop = true;
    else this.LanguageOtherDrop = false;
  }

  PrivteSchoolChange(event: MatRadioChange, data: any) {

    if (data === 'Yes') this.PrivateSchoolHaveDrop = true;
    else this.PrivateSchoolHaveDrop = false;
  }

  initializeFilterLanguage() {
    this.filteredToppingListlanguage.next(this.toppingListlanguage.slice());
    this.ChildNeedCareGroup.controls.providerLangFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchValueLanguage();
      });
  }
  initializeFilterValue() {
    this.filteredProvidersList.next(this.toppingListReligious.slice());
    this.affliationGroup.controls.providerMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchValueProvider();
      });

  }

  getReligions() {
    this.providerService.getReligions()
      .subscribe((response: any) => {
        this.toppingListReligious = response.data;
        //  this.filteredProvidersList = this.toppingListReligious;
        this.initializeFilterValue();

      })
  }
  getLanguages() {
    this.providerService.getLanguages()
      .subscribe((response: any) => {
        this.toppingListlanguage = response.data;
        //this.filteredToppingListlanguage = this.toppingListlanguage;
        this.initializeFilterLanguage();
      })
  }

  ReligiousChange(event: MatRadioChange, data: any) {

    if (data === 'Yes') this.ReligiousHaveDrop = true;
    else this.ReligiousHaveDrop = false;
  }

  checkFormValidity(stepCount: number, callback: any) {
    switch (stepCount) {
      case 0:
        if (!this.affliationGroup.value.religiousHave) {
          this.notificatioService.showError(CustomAlertMessage.affiliation[0].message);
          return callback(false);
        }
        let dataToSend: any = {
          is_religion_affliliation:
            this.affliationGroup.value.religiousHave == 'Yes' ? true : false,
        };

        if (this.affliationGroup.value.religiousHave == 'Yes') {
          if (!this.affliationGroup.value.toppingsReligious?.length) {
            this.notificatioService.showWarning(CustomAlertMessage.affiliation[1].message);
            return callback(false);
          }
          dataToSend = {
            ...dataToSend,
            religion: this.affliationGroup.value.toppingsReligious,
          };
        }

        return this.providerService.affiliation(dataToSend).subscribe({
          next: (data: any) => {
            const resData: any = data;
            callback(true);
          },
          error: (error: any) => {
            if (error?.error.errors.language[0]) {
              this.notificatioService.showWarning(
                error?.error.errors.language[0]
              );
            } else {
              this.notificatioService.showError('Some Error occured');
            }
            callback(false);
          },
        });
      // --------------------------------------------------------------------------------------
      case 1:
        if (!this.ChildNeedCareGroup.value.langHave) {
          this.notificatioService.showWarning(CustomAlertMessage.affiliation[0].message);
          return callback(false);
        }
        let dataToSendlang: any = {
          is_other_language:
            this.ChildNeedCareGroup.value.langHave == 'Yes' ? true : false,
        };

        if (this.ChildNeedCareGroup.value.langHave == 'Yes') {
          if (!this.ChildNeedCareGroup.value.toppingslanguage?.length) {
            this.notificatioService.showWarning(CustomAlertMessage.affiliation[2].message);
            return callback(false);
          }
          dataToSendlang = {
            ...dataToSendlang,
            language: this.ChildNeedCareGroup.value.toppingslanguage,
          };
        }

        return this.providerService.affiliation(dataToSendlang).subscribe({
          next: (data: any) => {
            const resData: any = data;
            callback(true);
          },
          error: (error: any) => {
            if (error?.error.errors.language[0]) {
              this.notificatioService.showWarning(
                error?.error.errors.language[0]
              );
            } else {
              this.notificatioService.showError('Some Error occured');
            }
            callback(false);
          },
        });
      // --------------------------------------------------------------------------------------
      case 2:
        if (!this.ChildNeedCareTK12.value.tk12) {
          this.notificatioService.showWarning(CustomAlertMessage.affiliation[0].message);
          return callback(false);
        }
        let dataToSendTK12: any = {
          is_tk12_program:
            this.ChildNeedCareTK12.value.tk12 == 'Yes' ? true : false,
        };

        return this.providerService.updateProviderSignupSteps(dataToSendTK12, localStorage.getItem('provider_id')).subscribe({
          next: (data: any) => {
            const resData: any = data;
            callback(true);
          },
          error: (error: any) => {
            if (error?.error.errors.language[0]) {
              this.notificatioService.showWarning(
                error?.error.errors.language[0]
              );
            } else {
              this.notificatioService.showError('Some Error occured');
            }
            callback(false);
          },

        });

      // --------------------------------------------------------------------------------------
      case 3:
        if (!this.ChildNeedCare.value.affiliatedProvider) {
          this.notificatioService.showWarning(CustomAlertMessage.affiliation[0].message);
          return callback(false);
        }
        let dataToSendProv: any = {
          is_affiliated_provider:
            this.ChildNeedCare.value.affiliatedProvider == 'Yes' ? true : false,
        };
        if (dataToSendProv.is_affiliated_provider) {
          if (!this.affiliatedProvidersList.length) {
            this.notificatioService.showError(CustomAlertMessage.affiliation[3].message)
            return callback(false);
          }
          let body: any = []
          for (let i = 0; i < this.affiliatedProvidersList.length; i++) {
            if (!this.addedAffiliationsId.includes(this.affiliatedProvidersList[i].id))
              body.push({
                main_provider: Number(localStorage.getItem('provider_id')),
                affiliated_provider: this.affiliatedProvidersList[i].id
              })
          }
          return this.providerService.addAffiliatedprovider(body)
            .subscribe({
              next: (data: any) => {
                // return callback(true);
                return this.providerService.affiliation(dataToSendProv).subscribe({
                  next: (data: any) => {

                    return callback(true);
                  },
                  error: (error: any) => {
                    if (error?.error.errors.language[0]) {
                      this.notificatioService.showWarning(
                        error?.error.errors.language[0]
                      );
                    } else {
                      this.notificatioService.showError('Some Error occured');
                    }
                    callback(false);
                  },

                });
              },
              error: (error: any) => {
                this.notificatioService.showError('Some Error occured');
                return callback(false);
              }
            })
        }
        else {
          return this.providerService.affiliation(dataToSendProv).subscribe({
            next: (data: any) => {

              return callback(true);
            },
            error: (error: any) => {
              if (error?.error.errors.language[0]) {
                this.notificatioService.showWarning(
                  error?.error.errors.language[0]
                );
              } else {
                this.notificatioService.showError('Some Error occured');
              }
              callback(false);
            },

          });
        }


    }
    return callback(true);
  }
  // ---------------------------------------------------------------------------------------
  getAffiliation() {
    this.providerService.saveAffiliation().subscribe({
      next: (data: any) => {
        let mapData = data?.data;
        if (mapData.is_religion_affliliation != null) {
          this.ReligiousHaveDrop = mapData.is_religion_affliliation;
        }
        if (mapData.is_religion_affliliation != null) {
          let selectBoxVal = mapData.religion.map((x: any) => x.id);
          this.affliationGroup.patchValue({
            religiousHave: mapData.is_religion_affliliation ? 'Yes' : 'No',
            toppingsReligious: selectBoxVal,
          });
        }
        if (mapData.is_affiliated_provider != null)
          this.ChildNeedCare.patchValue({
            affiliatedProvider: mapData.is_affiliated_provider ? 'Yes' : 'No',
          });

        if (mapData.is_other_language != null) {
          let selectBoxVal1 = mapData.language.map((x: any) => x.id);
          this.LanguageOtherDrop = mapData.is_other_language;
          this.ChildNeedCareGroup.patchValue({
            langHave: mapData.is_other_language ? 'Yes' : 'No',
            toppingslanguage: selectBoxVal1,
          });
        }
        if (mapData.is_tk12_program != null)
          this.ChildNeedCareTK12.patchValue({
            tk12: mapData.is_tk12_program ? 'Yes' : 'No',
          });
      },
    });
  }

  // For search provider
  search(event: any) {
    let searchData = event.target.value;
    this.filteredProvidersList = this.toppingListReligious.filter((x: any) => x.religion.toUpperCase().match(searchData.toUpperCase()));

  }

  searchLang(event: any) {
    let searchData = event.target.value;
    this.filteredToppingListlanguage = this.toppingListlanguage.filter((x: any) => x.language.toUpperCase().match(searchData.toUpperCase()));

  }

}
