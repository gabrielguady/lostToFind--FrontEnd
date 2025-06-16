import {Component, EventEmitter, Output} from '@angular/core';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {LostItem} from '../../../shared/models/lost-item';
import {ItemCategory} from '../../../shared/models/item-category';
import {BaseService} from '../../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {URLS} from '../../../shared/urls';
import {FormGroup} from '@angular/forms';
import {DatePipe, DecimalPipe} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommentsComponent} from '../../comments/comments.component';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.LOST_ITEM,
  nextRouter: 'lost_item',
  retrieveOnInit: true,
  paramsOnInit: {
    expand: ['user', 'category']
  }
}

@Component({
  selector: 'app-lost-item-details',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    CommentsComponent
  ],
  templateUrl: './lost-item-details.component.html',
  styleUrl: './lost-item-details.component.scss'
})
export class LostItemDetailsComponent extends BaseComponent<LostItem> {
  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: ItemCategory[];

  public images: string[] = [
    'https://m.media-amazon.com/images/I/51eVSpWDV0L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51cTSE89pSL._AC_SL1280_.jpg',
    'https://m.media-amazon.com/images/I/61SRMysUoAL._AC_SL1500_.jpg'
  ];
  public currentImage: number = 0;


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
    this.formGroup = new FormGroup({});
  }


  public prevImage(): void {
    this.currentImage = (this.currentImage === 0) ? this.images.length - 1 : this.currentImage - 1;
  }

  public nextImage(): void {
    this.currentImage = (this.currentImage + 1) % this.images.length;
  }

}
