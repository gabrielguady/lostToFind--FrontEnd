import {Component, OnInit} from '@angular/core';
import {URLS} from '../../shared/urls';
import {HttpClient} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {LostItem} from '../../shared/models/lost-item';
import {BaseService} from '../../shared/services/base.service';
import {DatePipe, DecimalPipe} from '@angular/common';


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
    DatePipe,
    MatButton,
    DecimalPipe
  ],
  providers: [DatePipe],
  templateUrl: './lost-list.component.html',
  styleUrl: './lost-list.component.scss'
})
export class LostItemListComponent implements OnInit {
  public dataSource: LostItem[] = [];
  public searchTitle: string = '';
  public searchCity: string = '';

  private router: Router = new Router();

  private service: BaseService<LostItem>

  constructor(
    http: HttpClient
  ) {
    this.service = new BaseService<LostItem>(http, URLS.LOST_ITEM);
  }

  ngOnInit(): void {
    this.search();
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter('title', this.searchTitle);
    this.service.addParameter('city', this.searchCity);
    this.service.addParameter('expand', ['user', 'category']);
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

}
