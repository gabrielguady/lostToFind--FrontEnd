
//   public save(entity: T): Observable<T> {
//     this.clearParameter();
//     const token = localStorage.getItem('access');
//     if (!token) {
//       throw new Error('Token não encontrado. O usuário não está autenticado.');
//     }
//
//     const url = this.fullUrl;
//     return this.http.post<T>(url, entity, { headers: this.headers });
//   }
//
//   public update(id: number | string, entity: any): Observable<T> {
//     this.clearParameter();
//     const url = `${this.fullUrl}${id}/`;
//     return this.http.patch<T>(url, entity, this.getOptions()) as Observable<T>;
//   }
//
//   // // Mét odo para buscar as imagens de um LostItem específico
//   // getImagesForLostItem(itemId: number): Observable<any> {
//   //   return this.http.get<any>(`${environment.apiUrl}/fileimage/`, {
//   //     params: new HttpParams().set('item_id', itemId.toString()).set('item_type', 'lost')
//   //   });
//   // }
//
//
//   // Método para buscar imagens de LostItem ou FoundItem
//   getImages(itemId: number, itemType: 'lost' | 'found'): Observable<FileImage[]> {
//     const params = new HttpParams()
//       .set('item_id', itemId.toString())  // Enviar o ID do item
//       .set('item_type', itemType);  // Enviar o tipo de item ('lost' ou 'found')
//
//     return this.http.get<FileImage[]>(this.fullUrl, { params });
//   }
//
// }


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLS } from '../urls';
import { HttpOptions } from '../http/http-options';
import { FileImage } from '../models/file-image';
import { LoginService } from './login.service';

export class BaseService<T> {
  private fullUrl = `${URLS.BASE}`;
  private parameters = new HttpParams();
  private loginService?: LoginService;

  constructor(
    public http: HttpClient,
    public path: string,
    loginService?: LoginService
  ) {
    this.fullUrl = `${URLS.BASE}${path}`;
    this.loginService = loginService;
  }

  private getAccessToken(): string {
    const token = this.loginService?.getAccessToken() ||
      localStorage.getItem('APP_ACCESS_TOKEN');
      sessionStorage.getItem('APP_ACCESS_TOKEN');
    return token || '';
  }


  public get headers(): HttpHeaders {
    const accessToken = this.getAccessToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (accessToken) {
      headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  }

  public getOptions(): HttpOptions {
    const httpOptions: HttpOptions = {
      headers: this.headers
    };
    if (this.parameters) {
      httpOptions.params = this.parameters;
    }
    return httpOptions;
  }

  addParameter(key: string, value: any) {
    this.parameters = this.parameters.set(key, value);
  }

  clearParameter() {
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

  public delete(id: number | string): Observable<any> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    return this.http.delete<any>(url, this.getOptions());
  }

  public save(entity: T): Observable<T> {
    this.clearParameter();
    const url = this.fullUrl;
    return this.http.post<T>(url, entity, this.getOptions());
  }

  public update(id: number | string, entity: any): Observable<T> {
    this.clearParameter();
    const url = `${this.fullUrl}${id}/`;
    return this.http.patch<T>(url, entity, this.getOptions()) as Observable<T>;
  }

  getImages(itemId: number, itemType: 'lost' | 'found'): Observable<FileImage[]> {
    const params = new HttpParams()
      .set('item_id', itemId.toString())
      .set('item_type', itemType);

    return this.http.get<FileImage[]>(this.fullUrl, { params });
  }
}
