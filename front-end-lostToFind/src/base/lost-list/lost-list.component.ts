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

  // addCommentScript(): void {
  //   // Cria a tag <script> dinamicamente
  //   const script = document.createElement('script');
  //   script.src = 'https://utteranc.es/client.js';
  //   script.setAttribute('repo', 'gabrielguady/LostToFind');
  //   script.setAttribute('issue-term', 'pathname');
  //   script.setAttribute('label', 'Comentários');
  //   script.setAttribute('theme', 'github-light');
  //   script.setAttribute('crossorigin', 'anonymous');
  //   script.async = true;
  //
  //   // Adiciona o script ao body ou a div onde você quer que ele seja carregado
  //   document.body.appendChild(script);
  // }


}
