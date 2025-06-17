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
import {DatePipe, DecimalPipe, NgClass} from '@angular/common';
import {LoginService} from '../../shared/services/login.service';
import {DeleteConfirmDialogComponent} from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import {switchMap, take, takeWhile} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';


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
    DecimalPipe,
    NgClass
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

  private service: BaseService<LostItem>;

  public isMined: boolean = false;

  constructor(
    http: HttpClient,
    private loginService: LoginService,
    public dialog: MatDialog,
    public toast: ToastrService,
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

    if (this.isMined) {
      this.service.addParameter('user', this.loginService.getCurrentUserId());
    }

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

  public stopPropagation(event: MouseEvent, stop = true): void {
    event.preventDefault();
    if (stop) {
      event.stopPropagation();
    }
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
}
