import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {URLS} from '../urls';
import {HttpOptions} from '../http/http-options';
import {LoginService} from './login.service';
import {FileImage} from '../models/file-image';
import {LostItem} from '../models/lost-item';


export class BaseService<T> {
  public fullUrl: string;

  private parameters: HttpParams = new HttpParams();
  private loginService: LoginService;

  constructor(
    public http: HttpClient,
    public path: string,
  ) {
    this.fullUrl = `${URLS.BASE}${path}`;
  }

  get headers(): HttpHeaders {
    const token = sessionStorage.getItem('access');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    if (token) {
      headers = headers.append('Authorization', 'Bearer '.concat(token));
    }
    return headers;
  }

  public getOptions(): HttpOptions {
    const httpOptions: HttpOptions = {};
    if (this.parameters) {
      httpOptions.params = this.parameters;
    }
    return httpOptions;
  }

  public addParameter(key: string, value: any): void {
    this.parameters = this.parameters.set(key, value);

  }

  public clearParameter(): void {
    this.parameters = new HttpParams();
  }

  public getAll(): Observable<T[]> {
    const url = this.fullUrl;
    return this.http.get<T[]>(url, this.getOptions());
  }


  public getById(id: number | string): Observable<T> {
    const url = `${this.fullUrl}${id}/`;
    return this.http.get<T>(url, this.getOptions());
  }


  public getUserById(id: number) {
    return this.http.get(
      `http://localhost:8000/api/core/user/${id}/`
    );
  }



  public save(entity: T): Observable<T> {
    this.clearParameter();
    const token = sessionStorage.getItem('access');
    if (!token) {
      throw new Error('Token não encontrado. O usuário não está autenticado.');
    }

    const url = this.fullUrl;
    return this.http.post<T>(url, entity, {headers: this.headers});
  }

  public update(id: number | string, entity: any): Observable<T> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    return this.http.patch<T>(url, entity, this.getOptions()) as Observable<T>;
  }
  public delete(id: number | string): Observable<any> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    return this.http.delete<any>(url, this.getOptions());
  }



}
