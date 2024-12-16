import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {NavigationExtras, Router} from '@angular/router';
import {LoginService} from '../../../shared/services/login.service';
import {InputPrimaryComponent} from '../input-primary/input-primary.component';
import {DefaultLoginLayoutComponent} from '../default-login-layout/default-login-layout.component';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public loginForm! : FormGroup;

  private router: Router = new Router();

  constructor(private loginService: LoginService) {

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username : new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    })
  }

  submit(){
    this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
      {
        next: () => this.navigate('lost_item'),
        error: () => console.log("error"),
      }
    )

  }

  public navigate(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }
}
