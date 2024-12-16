import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {NavigationExtras, Router} from '@angular/router';
import {LoginService} from '../../../shared/services/login.service';
import {InputPrimaryComponent} from '../input-primary/input-primary.component';
import {DefaultLoginLayoutComponent} from '../default-login-layout/default-login-layout.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    InputPrimaryComponent,
    AutofocusDirective,
    InputPrimaryComponent,
    DefaultLoginLayoutComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent  implements OnInit {

  public signupForm! : FormGroup;
  constructor(private signupService: LoginService, private router:Router) {

  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  submit() {
    if (this.signupForm.valid) {
      if (this.signupForm.value.password != this.signupForm.value.confirmPassword) {
        return console.log('error')
      }
      this.signupService.signup(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password).subscribe(
        {
          next: () => this.navigate('login'),
          error: () => console.log("error"),
        }
      )

    }
  }

  public navigate(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }




}
