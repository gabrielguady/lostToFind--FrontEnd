import {Component, OnInit} from '@angular/core';
import {URLS} from '../../shared/urls';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NavigationExtras, Router, RouterLink} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {LostItem} from '../../shared/models/lost-item';
import {BaseService} from '../../shared/services/base.service';
import {MatTooltip} from '@angular/material/tooltip';
import {DatePipe} from '@angular/common';


@Component({
  selector: 'app-item-lost-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatTooltip,
    RouterLink,
    DatePipe
  ],
  providers: [DatePipe],
  templateUrl: './lost-list.component.html',
  styleUrl: './lost-list.component.css'
})
export class LostItemListComponent implements OnInit {
  public dataSource: LostItem[] = [];
  public searchTitle: string = '';
  public searchLastSeen: string =  '';
  public searchCity: string = '';
  public itemImages: { [key: number]: any[] } = {};
  public imageAddress: string = 'https://camo.githubusercontent.com/e7260310f5d1a8a9473a908e039f348a459078b0ba1876d12fbe0a26c8a0e1a7/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67';

  private router: Router = new Router();

  private service: BaseService<LostItem>

  private parameters: HttpParams = new HttpParams();

  constructor(private http: HttpClient , private datePipe: DatePipe) {
    this.service =  new BaseService<LostItem>(http,URLS.LOST_ITEM)
  }
  ngOnInit(): void {
    this.search();
    // this.addCommentScript()
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter('title', this.searchTitle);
    this.service.addParameter('last_seen_details', this.searchLastSeen);
    this.service.addParameter('city', this.searchCity);
    this.service.getAll().subscribe({
      next: (data: LostItem[]) => {
        this.dataSource = data;
        this.loadImagesForItems();
      },
      error: (error) => {
        console.error('error loading Lost Item: ');
      }
    });
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras= {queryParamsHandling: "merge"}
    this.router.navigate([route], extras).then();
  }

  addCommentScript(itemId: number): void {
    // Cria a tag <script> dinamicamente
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'gabrielguady/LostToFind');  // Repositório no GitHub
    script.setAttribute('issue-term', `item-${itemId}`);  // Usando item.id como chave única para a "issue"
    script.setAttribute('label', 'Comentários');
    script.setAttribute('theme', 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    // Encontre o contêiner do item específico
    const container = document.getElementById(`utterances-container-${itemId}`);
    if (container) {
      container.appendChild(script);  // Adiciona o script no contêiner correto
    }
  }

  private loadImagesForItems(): void {
    this.dataSource.forEach(item => {
      this.loadImages(item.id);
      this.addCommentScript(item.id);
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


}
