import {Component, OnInit} from '@angular/core';
import {LostItem} from '../../shared/models/lost-item';
import {NavigationExtras, Router, RouterLink} from '@angular/router';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoginService} from '../../shared/services/login.service';
import {DatePipe, NgForOf} from '@angular/common';
import {URLS} from '../../shared/urls';
import {FoundItem} from '../../shared/models/found-item';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardImage, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {jwtDecode} from 'jwt-decode';
import {Observable} from 'rxjs';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-myitems',
  standalone: true,
  imports: [
    DatePipe,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
    MatFabButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatTooltip,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    MatIconButton,
    MatGridTile,
    MatGridList,
    NgForOf,
    MatCardSubtitle
  ],
  providers: [DatePipe],
  templateUrl: './myitems.component.html',
  styleUrl: './myitems.component.css'
})
export class MyitemsComponent implements OnInit {
  public dataSource: FoundItem[] = [];
  public datalostItems: LostItem[] = [];
  public id_person: number;
  public itemImages: { [key: number]: any[] } = {};
  public itemImagesFound: { [key: number]: any[] } = {};
  public imageAddress: string = 'https://camo.githubusercontent.com/e7260310f5d1a8a9473a908e039f348a459078b0ba1876d12fbe0a26c8a0e1a7/68747470733a2f2f7a7562652e696f2f66696c65732f706f722d756d612d626f612d63617573612f33363664616462316461323032353338616531333332396261333464393030362d696d6167652e706e67';


  private router: Router = new Router();

  private foundService: BaseService<FoundItem>
  private lostService: BaseService<LostItem>
  private parameters: HttpParams = new HttpParams();

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.foundService =  new BaseService<FoundItem>(http,URLS.FOUND_ITEM)
    this.lostService =  new BaseService<LostItem>(http,URLS.LOST_ITEM)
  }
  ngOnInit(): void {
    this.id_person = this.getUserId()
    this.searchFound();
    this.searchLost();
  }

  getUserId(): number | null {
    const token = sessionStorage.getItem('access');
    if (!token) {
      console.warn('Token não encontrado.');
      return null;
    }

    try {
      const decoded = jwtDecode<any>(token);
      return decoded.user_id || null;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }


  public searchFound(resetIndex: boolean = false): void {
    if (this.id_person) {
      this.getFoundItemsByUserId(this.id_person).subscribe({
        next: (items: FoundItem[]) => {
          this.dataSource = items;
          this.loadImagesForFound()
        },
        error: (err) => {
          console.error('Erro ao buscar itens perdidos:', err);
        }
      });
    } else {
      console.error('ID do usuário não encontrado.');
    }
  }



  public searchLost(resetIndex: boolean = false): void {
    if (this.id_person) {
      this.getLostItemsByUserId(this.id_person).subscribe({
        next: (items: LostItem[]) => {
          this.datalostItems = items;
          this.loadImagesForLost()
        },
        error: (err) => {
          console.error('Erro ao buscar itens perdidos:', err);
        }
      });
    } else {
      console.error('ID do usuário não encontrado.');
    }
  }

  private getLostItemsByUserId(userId: number): Observable<LostItem[]> {
    const params = new HttpParams().set('user_id', userId.toString());
    return this.http.get<LostItem[]>(this.lostService.fullUrl, { params });
  }
  private getFoundItemsByUserId(userId: number): Observable<FoundItem[]> {
    const params = new HttpParams().set('user_id', userId.toString());
    return this.http.get<FoundItem[]>(this.foundService.fullUrl, { params });
  }

  public deleteObjectLost(id:number): void {
    this.lostService.delete(id).subscribe({
      next: (_) => {
        this.searchLost()
      },
      error: (error) => {
        console.error('error delete Found Item: ');
      }
    })
  }
  public deleteObjectFound(id:number): void {
    this.foundService.delete(id).subscribe({
      next: (_) => {
        this.searchFound()
      },
      error: (error) => {
        console.error('error delete Found Item: ');
      }
    })
  }

  private loadImagesForFound(): void {
    this.dataSource.forEach(item => {
      this.loadImagesFound(item.id);
    });
  }
  private loadImagesForLost(): void {
    this.datalostItems.forEach(item => {
      this.loadImageslost(item.id);
    });
  }


  private loadImageslost(itemId: number): void {

    this.http.get<any[]>(`${URLS.BASE}api/core/file_image/?item_id=${itemId}&item_type=lost`).subscribe({
      next: (images) => {

        this.itemImages[itemId] = images;
      },
      error: (error) => {
        console.error('Error loading images: ', error);
      }
    });
  }

  private loadImagesFound(itemId: number): void {

    this.http.get<any[]>(`${URLS.BASE}api/core/file_image/?item_id=${itemId}&item_type=found`).subscribe({
      next: (images) => {

        this.itemImagesFound[itemId] = images;
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
