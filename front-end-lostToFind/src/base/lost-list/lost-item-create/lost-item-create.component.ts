import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LostItem} from '../../../shared/models/lost-item';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {AddPhotoComponent} from '../../add-photo-lost/add-photo.component';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {BaseService} from '../../../shared/services/base.service';
import {ItemCategory} from '../../../shared/models/item-category';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.LOST_ITEM,
  nextRouter: 'lost_item',
  retrieveOnInit: true
}

@Component({
  selector: 'app-lost-item-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutofocusDirective,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSelect,
    MatOption,
    AddPhotoComponent,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './lost-item-create.component.html',
  styleUrl: './lost-item-create.component.scss'
})
export class LostItemCreateComponent extends BaseComponent<LostItem> {
  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: ItemCategory[];

  public categoriesService: BaseService<ItemCategory>;

  constructor(http: HttpClient, toast: ToastrService, activatedRoute: ActivatedRoute) {
    super(http, BASE_OPTIONS, toast, activatedRoute);
    this.categoriesService = new BaseService<ItemCategory>(http, URLS.CATEGORY);
    this.getCategories();
  }

  public getCategories(): void {
    this.categoriesService.getAll()
      .subscribe((categories: ItemCategory[]) => {
        this.categories = categories;
      });
  }

  public createFormGroup(): void {
    this.formGroup = new FormGroup({
      title: new FormControl(this.object?.title ?? null, [Validators.required]),
      last_seen_details: new FormControl(this.object?.last_seen_details ?? null, [Validators.required]),
      date_lost: new FormControl(this.object?.date_lost ?? null, [Validators.required]),
      reward: new FormControl(this.object?.reward ?? null, [Validators.required]),
      category: new FormControl(this.object?.category ?? null, [Validators.required]),
      city: new FormControl(this.object?.city ?? null, [Validators.required]),
    });
  }

}
