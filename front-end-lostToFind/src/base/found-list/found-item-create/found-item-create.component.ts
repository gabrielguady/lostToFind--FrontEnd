import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {BaseService} from '../../../shared/services/base.service';
import {ItemCategory} from '../../../shared/models/item-category';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FoundItem} from '../../../shared/models/found-item';
import {MatSelect} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.FOUND_ITEM,
  nextRouter: 'found_item',
  retrieveOnInit: true
}

@Component({
  selector: 'app-found-item-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelect,
    MatDatepicker,
    MatDatepickerToggle,
    MatOption,
    MatDatepickerInput,

  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './found-item-create.component.html',
  styleUrl: './found-item-create.component.scss'
})
export class FoundItemCreateComponent extends BaseComponent<FoundItem> {
  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: ItemCategory[];
  selectedImage: File | null = null;

  public categoriesService: BaseService<ItemCategory>;

  constructor(http: HttpClient, toast: ToastrService, activatedRoute: ActivatedRoute, dialog: MatDialog,) {
    super(http, BASE_OPTIONS, toast, activatedRoute, dialog);
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
      description: new FormControl(this.object?.description ?? null, [Validators.required]),
      date_found: new FormControl(this.object?.date_found ?? null, [Validators.required]),
      category: new FormControl(this.object?.category ?? null, [Validators.required]),
      city: new FormControl(this.object?.city ?? null, [Validators.required]),
    });
  }

}
