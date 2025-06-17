import {Component, EventEmitter, Output} from '@angular/core';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {ItemCategory} from '../../../shared/models/item-category';
import {BaseService} from '../../../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {URLS} from '../../../shared/urls';
import {FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CommentsComponent} from '../../comments/comments.component';
import {MatDialog} from '@angular/material/dialog';
import {FoundItem} from '../../../shared/models/found-item';
import {MatTooltip} from '@angular/material/tooltip';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.FOUND_ITEM,
  nextRouter: 'found_item',
  retrieveOnInit: true,
  paramsOnInit: {
    expand: ['user', 'category']
  }
}

@Component({
  selector: 'app-found-item-details',
  standalone: true,
  imports: [
    DatePipe,
    MatCard,
    MatCardContent,
    MatIcon,
    MatIconButton,
    CommentsComponent,
  ],
  templateUrl: './found-item-details.component.html',
  styleUrl: './found-item-details.component.scss'
})
export class FoundItemDetailsComponent extends BaseComponent<FoundItem> {
  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: ItemCategory[];
  selectedImage: File | null = null;

  public images: string[] = [
    'https://m.media-amazon.com/images/I/51eVSpWDV0L._AC_SL1500_.jpg',
    'https://m.media-amazon.com/images/I/51cTSE89pSL._AC_SL1280_.jpg',
    'https://m.media-amazon.com/images/I/61SRMysUoAL._AC_SL1500_.jpg'
  ];
  public currentImage: number = 0;


  public categoriesService: BaseService<ItemCategory>;
  private http: HttpClient;

  constructor(http: HttpClient, toast: ToastrService, activatedRoute: ActivatedRoute, dialog: MatDialog,) {
    super(http, BASE_OPTIONS, toast, activatedRoute, dialog);
    this.categoriesService = new BaseService<ItemCategory>(http, URLS.CATEGORY);
    this.getCategories();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        this.selectedImage = file;  // Armazenando o arquivo selecionado
      };
      reader.readAsDataURL(file);
    }
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
