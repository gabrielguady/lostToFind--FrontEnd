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
import {LoginService} from '../../shared/services/login.service';

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
  public deleteObject(id:number): void {
    this.service.delete(id).subscribe({
      next: (_) => {
        this.search()
      },
      error: (error) => {
        console.error('error delete Found Item: ');
      }
    })
  }
  // Função para carregar imagens associadas a cada FoundItem
  private loadImagesForItems(): void {
    this.dataSource.forEach(item => {
      this.loadImages(item.id);
    });
  }

  // Função para fazer a requisição das imagens associadas ao FoundItem
  private loadImages(itemId: number): void {
    // Aqui você faz uma requisição para o endpoint que retorna as imagens
    this.http.get<any[]>(`${URLS.BASE}api/core/file_image/?item_id=${itemId}&item_type=found`).subscribe({
      next: (images) => {
        console.log('URL da requisição:', `${URLS.FILE_IMAGE}?item_id=${itemId}&item_type=found`);

        this.itemImages[itemId] = images;  // Associa as imagens ao item com o id
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
