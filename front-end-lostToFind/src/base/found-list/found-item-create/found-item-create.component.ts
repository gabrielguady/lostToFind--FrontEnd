import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FoundItem} from '../../../shared/models/found-item';
import {URLS} from '../../../shared/urls';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgIf} from '@angular/common';
import {AddPhotoComponent} from '../../add-photo-found/add-photo-found.component';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.FOUND_ITEM,
  nextRouter: 'found_item',
}

@Component({
  selector: 'app-found-item-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,

    AutofocusDirective,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatSelect,
    MatOption,
    AddPhotoComponent,
    NgIf,
    AddPhotoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './found-item-create.component.html',
  styleUrl: './found-item-create.component.scss'
})
export class FoundItemCreateComponent extends BaseComponent<FoundItem> {

  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: { value: number, label: string }[] = [
    {value: 1, label: 'Acessórios'},
    {value: 2, label: 'Documentos pessoais'},
    {value: 3, label: 'Eletrônicos'},
    {value: 4, label: 'Cartão de crédito'},
    {value: 5, label: 'Pets'},
    {value: 6, label: 'Outros'},
  ];

  constructor(http: HttpClient, toast: ToastrService,activatedRoute: ActivatedRoute) {
    super(http, BASE_OPTIONS, toast, activatedRoute)
  }

  public createFormGroup(): void {
    this.formGroup = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      date_found: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
    });
  }

}
