import {Inject, inject, Injectable, PLATFORM_ID} from '@angular/core';
import {BehaviorSubject, filter, map, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {Router, UrlTree} from '@angular/router';
import {isPlatformBrowser} from '@angular/common';

export const ACCESS_TOKEN_KEY = 'APP_ACCESS_TOKEN';
export const REFRESH_TOKEN_KEY = 'APP_REFRESH_TOKEN';
export interface UserData {
  accessToken: string;
  refreshToken: string;
  user_id?: string;
  username?: string;
}
interface DecodedToken extends JwtPayload {
  user_id?: number;
  username?: string;
}
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public user = new BehaviorSubject<UserData | null | undefined>(undefined);
  constructor(private http: HttpClient,  @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUser();
    }
  }
  private decodeToken(token: string): DecodedToken {
    return jwtDecode<DecodedToken>(token);
  }
  loadUser() {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (accessToken && refreshToken) {
      const decoded = this.decodeToken(accessToken);
      const data: UserData = {
        accessToken,
        refreshToken,
        user_id: decoded.user_id?.toString(),
        username: decoded.username
      };
      this.user.next(data);
    } else {
      this.user.next(null);
    }
  }
  signup(username: string, password: string): Observable<UserData> {
    return this.http.post<UserData>('http://localhost:8000/api/core/user/', {username, password}).pipe(
      tap((value) => {
      })
    )
  }
  login(username: string, password: string) {
    return this.http
      .post('http://localhost:8000/api/token/', {username, password})
      .pipe(
        map((response: any) => {
          const access = response.access;
          const refresh = response.refresh;
          const decoded = this.decodeToken(access);
          const data: UserData = {
            accessToken: access,
            refreshToken: refresh,
            user_id: decoded.user_id?.toString(),
            username: decoded.username
          };
          localStorage.setItem(ACCESS_TOKEN_KEY, access);
          localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
          this.user.next(data);
          return data;
        })
      );
  }
  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.user.next(null);
  }
  getCurrentUser() {
    return this.user.asObservable();
  }
  getCurrentUserId() {
    return this.user.getValue()?.user_id;
  }
  getUsername() {
    return this.user.getValue()?.username;
  }
  getAccessToken() {
    return this.user.getValue()?.accessToken;
  }
  getRefreshToken() {
    return this.user.getValue()?.refreshToken;
  }
  isLoggedIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);
    return this.getCurrentUser().pipe(
      filter(user => user !== undefined),
      map(isAuthenticated => isAuthenticated ? true : router.createUrlTree(['/']))
    );
  }
  shouldLogIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);
    return this.getCurrentUser().pipe(
      filter(user => user !== undefined),
      map(isAuthenticated => isAuthenticated ? router.createUrlTree(['/login']) : true)
    );
  }

  getUserEmail() {
    const router = inject(Router);
  }
}
