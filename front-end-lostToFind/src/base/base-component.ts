import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../shared/services/base.service';


export class BaseComponent<T> {
  private router: Router = new Router();
  public service: BaseService<T>;

  constructor(http: HttpClient, url: string) {
    this.service = new BaseService<T>(http, url);
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }
}
