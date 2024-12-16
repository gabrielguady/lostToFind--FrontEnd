import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideAnimations} from '@angular/platform-browser/animations';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {provideToastr} from 'ngx-toastr';

const appearence: MatFormFieldDefaultOptions = {
  appearance: "outline"
}

export const appConfig: ApplicationConfig = {
  providers:
    [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideClientHydration(),
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClient(withFetch()), provideAnimationsAsync(),
      provideAnimations(),
      { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: appearence }, provideAnimationsAsync(), provideAnimationsAsync(),
      provideToastr(),
    ],

};
