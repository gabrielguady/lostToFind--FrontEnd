import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {loginResponse} from '../types/login-response';
import {jwtDecode} from 'jwt-decode';
import {User} from '../models/accounts';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8000/';


  constructor(private http: HttpClient) {
  }

  get headers(): HttpHeaders {
    const access = sessionStorage.getItem('access');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (access) {
      headers = headers.append('Authorization', 'Bearer '.concat(access));
    }
    return headers;
  }

  signup(username: string, email: string, password: string): Observable<loginResponse> {
    return this.http.post<loginResponse>(`${this.apiUrl}api/core/signup/`, {username, email, password}).pipe(
      tap((value) => {
        sessionStorage.setItem("access", value.access)
      })
    )
  }

  public login(username: string, password: string) {
    return this.http.post<loginResponse>(`${this.apiUrl}token/`, {username, password}, {withCredentials: true}
    ).pipe(
      tap((value) => {
        sessionStorage.setItem('access', value.access);
        sessionStorage.setItem('refresh', value.refresh);
      })
    );
  }


  get user(): User | null {
    const access = sessionStorage.getItem('access');

    if (!access) {
      console.warn('Nenhum access encontrado no armazenamento.');
      return null;
    }

    try {
      const payload = jwtDecode<any>(access);
      console.log(payload.user_id);

      if (!payload.user_id) {
        console.error('Token JWT não contém as informações esperadas:', payload);
        return null;
      }

      return {
        id: payload.user_id,
        username: payload.username,
        email: payload.email,
        created_at: payload.created_at,
        modified_at: payload.modified_at,
      };
    } catch (error) {
      console.error('Erro ao decodificar o access JWT:', error);
      return null;
    }
  }

  public getUserById(id: number) {
    return this.http.get(
      this.apiUrl.concat('api/core/user') + id,
      {headers: this.headers, withCredentials: true}
    )
  }


  public getToken(): string | null {
    return sessionStorage.getItem('access');

  }

  public isAuthenticated(): boolean {
    const access = this.getToken();
    return access !== null;
  }

  public logout(): void {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    console.log('Usuário desconectado.');
  }

  private handleError(error: any): Observable<any> {
    console.error(error);
    return throwError(error);
  }
}
