import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {BaseComponent, BaseComponentOptions} from '../../base.component';
import {User} from '../../../shared/models/accounts';
import {URLS} from '../../../shared/urls';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';

const BASE_OPTIONS: BaseComponentOptions = {
  url: URLS.USER
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent extends BaseComponent<User> {

  constructor(http: HttpClient, toast: ToastrService, activatedRoute: ActivatedRoute,dialog: MatDialog,) {
    super(http, BASE_OPTIONS, toast, activatedRoute, dialog);
  }

  public override createFormGroup() {
    this.formGroup =  new FormGroup({
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      username: new FormControl(null),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  public override saveOrUpdateForm() {
    const password = this.formGroup.get('password')?.value;
    const confirmPassword = this.formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      this.toast.error('As senhas não coincidem.');
      this.formGroup.get('confirmPassword')?.setErrors({mismatch: true});
      return;
    }
    this.formGroup.get('username')?.setValue(this.formGroup.get('email').value);
    this.formGroup.removeControl('confirmPassword');
    super.saveOrUpdateForm(()=>{
      this.goToPage('login')
    });
  }
}
