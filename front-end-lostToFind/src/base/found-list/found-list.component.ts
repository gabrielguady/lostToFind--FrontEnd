import {Component, OnInit} from '@angular/core';
import {FoundItem} from '../../shared/models/found-item';
import {URLS} from '../../shared/urls';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NavigationExtras, Router, RouterLink} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatTooltip} from '@angular/material/tooltip';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-item-found-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTooltip,
    RouterLink,
    DatePipe,
    NgIf,
  ],
  providers: [DatePipe],
  templateUrl: './found-list.component.html',
  styleUrl: './found-list.component.css'
})
export class FoundItemListComponent implements OnInit {
  public dataSource: FoundItem[] = [];
  public searchName: string = '';
  public searchCity: string='';
  public searchDescription: string =  '';
  public itemImages: { [key: number]: any[] } = {};
  public imageAdress: string = 'https://camo.githubusercontent.com/e7260310f5d1a8a9473a908e039f348a459078b0ba1876d12fbe0a26c8a0e1a7/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67';


  private router: Router = new Router();

  private service: BaseService<FoundItem>
  private parameters: HttpParams = new HttpParams();

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.service =  new BaseService<FoundItem>(http,URLS.FOUND_ITEM)
  }
  ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter('title', this.searchName);
    this.service.addParameter('description', this.searchDescription);
    this.service.addParameter('city', this.searchCity);
    this.service.getAll().subscribe({
      next: (data: FoundItem[]) => {
        this.dataSource = data;
        this.loadImagesForItems();
      },
      error: (error) => {
        console.error('error loading Found Item: ');
      }
    });
  }
  // public deleteObject(id:number): void {
  //   this.service.delete(id).subscribe({
  //     next: (_) => {
  //       this.search()
  //     },
  //     error: (error) => {
  //       console.error('error delete Found Item: ');
  //     }
  //   })
  // }

  private loadImagesForItems(): void {
    this.dataSource.forEach(item => {
      this.loadImages(item.id);
    });
  }


  private loadImages(itemId: number): void {

    this.http.get<any[]>(`${URLS.BASE}api/core/file_image/?item_id=${itemId}&item_type=found`).subscribe({
      next: (images) => {

        this.itemImages[itemId] = images;
      },
      error: (error) => {
        console.error('Error loading images: ', error);
      }
    });
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras= {queryParamsHandling: "merge"}
    this.router.navigate([route], extras).then();
  }


}
