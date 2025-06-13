import { Component, OnInit } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import jwtDecode from 'jwt-decode';
import {LoginService} from '../../shared/services/login.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    FormsModule,
    MatCard,
    MatFormField,
    MatInput,
    MatIcon,
    MatLabel,
    NgIf,
    MatIconButton,
    RouterLinkActive
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  name: string = '';
  email: string = 'user@example.com';
  phone: string = '+55 (99) 99999-9999';

  isEditing: boolean = false;
  originalName: string = '';
  originalEmail: string = '';
  originalPhone: string = '';

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('APP_ACCESS_TOKEN');
    console.log('Token JWT:', token);
    const username = this.loginService.getUsername();
    if (username) {
      this.name = username; // aqui o nome é preenchido dinamicamente
    }
  }

  edit() {
    this.isEditing = true;
    this.originalName = this.name;
    this.originalEmail = this.email;
    this.originalPhone = this.phone;
  }

  save() {
    this.isEditing = false;
    // Aqui pode adicionar integração com API para salvar
  }

  cancel() {
    this.name = this.originalName;
    this.email = this.originalEmail;
    this.phone = this.originalPhone;
    this.isEditing = false;
  }
}




