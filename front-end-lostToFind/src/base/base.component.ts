import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';
import {BaseService} from '../shared/services/base.service';
import {HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {Directive, OnInit} from '@angular/core';
import {map, Observable, switchMap, take} from 'rxjs';
import {ToastrService} from 'ngx-toastr';


export const handler = (event: number, callback?: (event: number) => void): void => {
  if (callback) {
    callback(event);
  }
};

export const EVENT = {
  RETRIEVE: 0,
  SAVE: 1,
  UPDATE: 2,
  DELETE: 3,
};

export interface BaseComponentOptions {
  pk?: string;
  url: string;
  nextRouter?: string;
  paramsOnInit?: {};
  retrieveOnInit?: boolean;
}

@Directive()
export abstract class BaseComponent<T> implements OnInit {
  private router: Router = new Router();
  public service: BaseService<T>;
  public formGroup: FormGroup;
  public object: T = {} as T;
  public pk: string = 'id';
  public toast: ToastrService;
  public activatedRoute: ActivatedRoute;


  protected constructor(
    http: HttpClient,
    public options: BaseComponentOptions,
    toast: ToastrService,
    activatedRoute: ActivatedRoute
  ) {
    this.service = new BaseService<T>(http, this.options.url);
    this.pk = this.options.pk || 'id';
    this.toast = toast;
    this.activatedRoute = activatedRoute;
  }

  public ngOnInit(callback?: () => void): void {
    this.createFormGroup();
    if (this.options.retrieveOnInit) {
      this.retrieve();
    } else {
      handler(EVENT.RETRIEVE, callback);
    }
  }

  public abstract createFormGroup(): void;

  public goToPage(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }

  public saveOrUpdateForm(callback?: (event: number) => void): void {
    // Get data to save or update
    let data: {} = {};
    Object.keys(this.formGroup.getRawValue()).forEach((key: string): void => {
      const value = this.formGroup.getRawValue()[key];
      if (value !== null && value !== undefined) {
        data[key] = value;
      }
    });

    this._saveOrUpdateData(data, callback);
  }

  private _saveOrUpdateData(
    data: object | T | FormData,
    callback?: (event: number) => void,
  ): void {
    if (!this.formGroup.valid) return;
    // Save or update according ID
    if (this.object[this.pk]) {
      this.service
        .update(this.object[this.pk], data)
        .pipe(take(1))
        .subscribe((response) => {
          this.toast.success('Sucesso', 'Atualizado com sucesso');
          this.object = response;
          if (this.options.nextRouter) {
            this.goToPage(this.options.nextRouter);
          }
          handler(EVENT.UPDATE, callback);
        });
    } else {
      this.service
        .save(data as T)
        .pipe(take(1))
        .subscribe((response) => {
          this.toast.success('Sucesso', 'Salvo com sucesso');
          this.object = response;
          if (this.options.nextRouter) {
            this.goToPage(this.options.nextRouter);
          }
          handler(EVENT.SAVE, callback);
        });
    }
  }

  public beforeRetrieve(): Observable<number | string> {

    return this.activatedRoute.params.pipe(
      take(1),
      map((params: Params) => {
        const id = params['action'];
        return id && id !== 'create' ? id : null;
      })
    );
  }

  public retrieve(callback?: () => void): void {
    this.service.clearParameter();

    if (this.options.paramsOnInit) {
      const parameters: {} = this.options.paramsOnInit;
      Object.keys(parameters).forEach((t) => this.service.addParameter(t, parameters[t]));
    }

    this.beforeRetrieve()
      .pipe(
        take(1),
        switchMap((id: number | string) => {
          if (id) {
            this.object[this.pk] = id;
            return this.service.getById(id);
          } else {
            return this.service.getAll();
          }
        })
      ).subscribe((response: T) => {
        if(response){
          this.object = response;
          if (this.formGroup) {
            this.formGroup.reset(this.object);
          }
        }
        handler(EVENT.RETRIEVE, callback);
      }
    );
  }
}
