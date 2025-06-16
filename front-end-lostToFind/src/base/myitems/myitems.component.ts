import {Component, OnInit} from '@angular/core';
import {LostItem} from '../../shared/models/lost-item';
import {NavigationExtras, Router} from '@angular/router';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoginService} from '../../shared/services/login.service';
import {DatePipe, DecimalPipe} from '@angular/common';
import {URLS} from '../../shared/urls';
import {FoundItem} from '../../shared/models/found-item';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader, MatCardImage,
} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-myitems',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatFabButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    MatCardHeader,
    MatCardActions,
    MatCardImage
  ],
  providers: [DatePipe],
  templateUrl: './myitems.component.html',
  styleUrl: './myitems.component.scss'
})
export class MyitemsComponent implements OnInit {
  public dataSource: FoundItem[] = [];
  public datalostItems: LostItem[] = [];

  public searchTitle: string = '';
  public searchCity: string = '';

  private router: Router = new Router();

  private foundService: BaseService<FoundItem>;
  private lostService: BaseService<LostItem>;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    this.foundService = new BaseService<FoundItem>(http, URLS.FOUND_ITEM);
    this.lostService = new BaseService<LostItem>(http, URLS.LOST_ITEM);
  }

  ngOnInit(): void {
    this.search();
  }

  public search(): void {
    this.searchFound();
    this.searchLost();
  }

  private searchFound(): void {
    const userId = this.loginService.getCurrentUserId();
    if (!userId) return;

    this.foundService.clearParameter();
    this.foundService.addParameter('title', this.searchTitle);
    this.foundService.addParameter('city', this.searchCity);
    this.foundService.addParameter('expand', ['user', 'category']);
    this.foundService.addParameter('user_id', userId);  // <- Aqui filtra pelo usuário

    this.foundService.getAll().subscribe({
      next: (data: FoundItem[]) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('Error loading Found Items:', error);
      }
    });
  }

  private searchLost(): void {
    const userId = this.loginService.getCurrentUserId();
    if (!userId) return;

    this.lostService.clearParameter();
    this.lostService.addParameter('title', this.searchTitle);
    this.lostService.addParameter('city', this.searchCity);
    this.lostService.addParameter('expand', ['user', 'category']);
    this.lostService.addParameter('user_id', userId); // <- Aqui também

    this.lostService.getAll().subscribe({
      next: (data: LostItem[]) => {
        this.datalostItems = data;
      },
      error: (error) => {
        console.error('Error loading Lost Items:', error);
      }
    });
  }

  public deleteFoundItem(id: number): void {
    this.foundService.delete(id).subscribe({
      next: () => this.searchFound(),
      error: (error) => console.error('Error deleting Found Item:', error)
    });
  }

  public deleteLostItem(id: number): void {
    this.lostService.delete(id).subscribe({
      next: () => this.searchLost(),
      error: (error) => console.error('Error deleting Lost Item:', error)
    });
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }
}
