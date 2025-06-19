import {Component, OnInit} from '@angular/core';
import {FoundItem} from '../../shared/models/found-item';
import {URLS} from '../../shared/urls';
import {BaseService} from '../../shared/services/base.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {NavigationExtras, Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {DeleteConfirmDialogComponent} from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import {switchMap, take, takeWhile} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {LostItem} from '../../shared/models/lost-item';
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
    DatePipe,
    NgClass,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  templateUrl: './found-list.component.html',
  styleUrl: './found-list.component.scss'
})
export class FoundItemListComponent implements OnInit {
  public searchTitle: string = '';
  public searchAIText: string = '';
  public dataSource: FoundItem[] = [];
  public searchCity: string='';
  public itemImages: { [key: number]: any[] } = {};

  public isMined: boolean = false;

  private router: Router = new Router();

  private service: BaseService<FoundItem>
  private parameters: HttpParams = new HttpParams();

  public formSearch: FormGroup;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private loginService: LoginService,
    public toast: ToastrService,
  ) {
    this.service = new BaseService<FoundItem>(http, URLS.FOUND_ITEM);
  }

  ngOnInit(): void {
    this.search();
    this.formSearch = new FormGroup({
      lost_description: new FormControl('', [Validators.required]),
    });
  }

  public search(resetIndex: boolean = false): void {
    this.service.clearParameter();
    this.service.addParameter('search', this.searchTitle);
    this.service.addParameter('city', this.searchCity);

    if (this.isMined) {
      this.service.addParameter('user', this.loginService.getCurrentUserId());
    }

    this.service.addParameter('expand', ['user', 'category']);
    this.service.getAll().subscribe({
      next: (data: FoundItem[]) => {
        this.dataSource = data;
      },
      error: (error) => {
        console.error('error loading Lost Item: ');
      }
    });
  }

  public searchAI(): void {
    this.service.clearParameter();
    this.service.addParameter('expand', ['user', 'category']);
    const payload = {
      lost_description: this.searchAIText,
    }
    this.service.searchAI(payload).subscribe((data: FoundItem[])=>{
      this.dataSource = data;
    });
  }

  public delete(pk: number, data: object = {}, eventMouse?: MouseEvent, callback?: (event: number) => void): boolean {
    if (eventMouse) this.stopPropagation(eventMouse);
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '40vw',
      data: {
        id: pk,
        title: data['title'] ? data['title'] : 'delete',
        message: data['message'] ? data['message'] : 'delete-confirm',
        description: data['description'] ? data['description'] : '',
        confirmationButton: data['confirmationButton'] ? data['confirmationButton'] : 'yes-delete',
      },
      disableClose: false,
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        takeWhile((result: any) => !!result),
        switchMap(() => this.service.delete(pk))
      )
      .subscribe(() => {
        this.toast.success('success', data['successMessage'] ? data['successMessage'] : 'deleted-successfully');
        this.search();
      });

    return false;
  }

  // carregar imagens associadas a cada FoundItem
  private loadImagesForItems(): void {
    this.dataSource.forEach(item => {
      this.loadImages(item.id);
    });
  }

  // fazer a requisição das imagens associadas ao FoundItem
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

  public stopPropagation(event: MouseEvent, stop = true): void {
    event.preventDefault();
    if (stop) {
      event.stopPropagation();
    }
  }


}
