import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NavigationExtras, Router} from '@angular/router';
import {LoginService} from '../../../shared/services/login.service';
import {InputPrimaryComponent} from '../input-primary/input-primary.component';
import {DefaultLoginLayoutComponent} from '../default-login-layout/default-login-layout.component';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
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

    const { name, username, password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      console.log('As senhas não coincidem.');

      this.snackBar.open('As senhas não coincidem', 'Fechar', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      return;

    }

    this.signupService.signup(username, password).subscribe({
      next: () => {
        this.snackBar.open('Usuário cadastrado com sucesso!', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        this.navigate('login');

      },

      error: (err) => {
        console.error('Erro ao cadastrar usuário:', err);

        this.snackBar.open('Erro no cadastro. Verifique suas credenciais.', 'Fechar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  public navigate(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }

}
