// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { LoginService } from './login.service';
// import {Observable} from 'rxjs';
//
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuardService implements CanActivate {
//   constructor(private loginService: LoginService, private router: Router) {}
//
//   canActivate(
//     next: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     const isAuthenticated = this.loginService.isLoggedIn();
//
//     console.log('Auth Guard - Autenticado:', isAuthenticated);
//
//     if (isAuthenticated) {
//       return true;
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
//
// }
