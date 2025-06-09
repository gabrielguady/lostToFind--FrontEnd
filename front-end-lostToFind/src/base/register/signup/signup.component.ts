import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
    InputPrimaryComponent,
    DefaultLoginLayoutComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {

  public signupForm!: FormGroup;

  constructor(
    private signupService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  submit() {
    if (this.signupForm.invalid) {
      console.warn('Formulário inválido.');
      return;
    }

    const { username, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      console.warn('As senhas não coincidem.');
      return;
    }

    this.signupService.signup(username, password).subscribe({
      next: () => {
        console.log('Usuário cadastrado com sucesso!');
        this.navigate('login');
      },
      error: (err) => {
        console.error('Erro ao cadastrar usuário:', err);
      }
    });
  }

  public navigate(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }

}
