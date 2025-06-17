import {ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {LoginService} from '../shared/services/login.service';

@Injectable()
export class AppGuard {
  constructor(
    public loginService: LoginService,
    public router: Router
  ) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication(state);
  }

  private checkAuthentication(state?: RouterStateSnapshot): boolean {
    return this.isLogged();
  }

  private isLogged(): boolean {
    if (this.loginService.isLoggedIn()) {
      return true;
    }
    this.loginService.logout();
    this.router.navigate(['/login']).then();
    return false;
  }

  private static formatRoute(route: string) {
    return route.endsWith('/') ? route : route.concat('/');
  }
}
