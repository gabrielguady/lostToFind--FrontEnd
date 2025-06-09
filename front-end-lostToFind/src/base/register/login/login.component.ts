import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutofocusDirective } from '../../../shared/directives/auto-focus-directive';
import { NavigationExtras, Router } from '@angular/router';
import { LoginService } from '../../../shared/services/login.service';
import { DefaultLoginLayoutComponent } from '../default-login-layout/default-login-layout.component';
import {InputPrimaryComponent} from '../input-primary/input-primary.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    InputPrimaryComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.loginService.login(username, password).subscribe({
        next: () => {
          const user = this.loginService.user;
          console.log('Usuário logado:', user || 'não definido');
          this.navigate('home');
        },
        error: (err) => {
          console.error('Erro ao fazer login:', err);
        }
      });
    }
  }

  public navigate(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }
}

// submit(){
//   this.loginService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe(
//     {
//       next: () => this.navigate('lost_item'),
//       error: () => console.log("error"),
//     }
//   )
//
// }
