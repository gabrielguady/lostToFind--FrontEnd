import {Component, OnInit} from '@angular/core';
import {LostItem} from '../../shared/models/lost-item';
import {NavigationExtras, Router, RouterLink} from '@angular/router';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LoginService} from '../../shared/services/login.service';
import {DatePipe} from '@angular/common';
import {URLS} from '../../shared/urls';
import {FoundItem} from '../../shared/models/found-item';
import {MatButton, MatFabButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatTooltip} from '@angular/material/tooltip';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

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
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './myitems.component.html',
  styleUrl: './myitems.component.css'
})
export class MyitemsComponent implements OnInit {
  public dataSource: FoundItem[] = [];
  public datalostItems: LostItem[] = [];
  public displayedColumns = ['id', 'title', 'description', 'date_found', 'category', 'city', 'actions'];
  public searchName: string = '';

  private router: Router = new Router();

  private Foundservice: BaseService<FoundItem>
  private Lostservice: BaseService<LostItem>
  private parameters: HttpParams = new HttpParams();
  private loginService: LoginService;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.Foundservice =  new BaseService<FoundItem>(http,URLS.FOUND_ITEM)
    this.Lostservice =  new BaseService<LostItem>(http,URLS.LOST_ITEM)
  }
  ngOnInit(): void {
    this.searchFound();
    this.searchLost()
  }

  public searchFound(resetIndex: boolean = false): void {
    this.Foundservice.clearParameter();
    this.Foundservice.addParameter('title', this.searchName);
    this.Foundservice.getAll().subscribe({
      next: (data: FoundItem[]) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('error loading Found Item: ');
      }
    });
  }
  public deleteObject(id:number): void {
    this.Foundservice.delete(id).subscribe({
      next: (_) => {
        this.searchFound()
      },
      error: (error) => {
        console.error('error delete Found Item: ');
      }
    })
  }
  public searchLost(resetIndex: boolean = false): void {
    this.Lostservice.clearParameter();
    this.Foundservice.addParameter('title', this.searchName);
    this.Lostservice.getAll().subscribe({
      next: (data: LostItem[]) => {
        this.datalostItems = data;
      },
      error: (error) => {
        console.error('error loading Found Item: ');
      }
    });
  }
  public deleteObjectLost(id:number): void {
    this.Lostservice.delete(id).subscribe({
      next: (_) => {
        this.searchLost()
      },
      error: (error) => {
        console.error('error delete Found Item: ');
      }
    })
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras= {queryParamsHandling: "merge"}
    this.router.navigate([route], extras).then();
  }


}
