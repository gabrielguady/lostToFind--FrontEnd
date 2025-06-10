// import { Injectable, inject } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import {LoginService} from '../shared/services/login.service';
//
//
// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private loginService = inject(LoginService);
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.loginService.getAccessToken();
//     if (token) {
//       const authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return next.handle(authReq);
//     }
//     return next.handle(req);
//   }
// }
