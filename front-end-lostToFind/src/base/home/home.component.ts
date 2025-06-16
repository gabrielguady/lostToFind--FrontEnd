import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {NgForOf, NgIf} from '@angular/common';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    RouterLink,
    Card,
    PrimeTemplate,
    NgIf,
    NgForOf,
    MatIcon,
    MatIconButton,
    RouterLinkActive
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchTerm = ''

  emailNewsletter: string = '';

  usefulLinks = [
    { label: 'Início', route: '/' },
    { label: 'Sobre Nós', route: '/about' }
  ];

  contactInfo = [
    { icon: 'pi pi-envelope', text: 'losttofind@gmail.com', type: 'email', value: 'losttofind@gmail.com' },
    { icon: 'pi pi-phone', text: '(92) 98765-4321', type: 'phone', value: '+5592987654321' },
    { icon: 'pi pi-map-marker', text: 'Manaus, Amazonas', type: 'location', value: 'Manaus, Amazonas, Brazil' } // Adicione "Brazil" para melhor precisão na busca
  ];

  constructor() { }

  ngOnInit(): void {
  }

  subscribeToNewsletter(): void {
    if (this.emailNewsletter && this.isValidEmail(this.emailNewsletter)) {
      console.log('E-mail cadastrado para newsletter:', this.emailNewsletter);
      alert(`Obrigado por se inscrever, ${this.emailNewsletter}!`);
      this.emailNewsletter = '';
    } else {
      alert('Por favor, digite um e-mail válido para se inscrever.');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Lógica CORRIGIDA para lidar com o clique em um item de contato
  handleContactClick(item: any): void {
    if (item.type === 'email') {
      window.location.href = `mailto:${item.value}`;
    } else if (item.type === 'phone') {
      window.location.href = `tel:${item.value}`;
    } else if (item.type === 'location') {
      // Codifica o valor para URL seguro e abre o Google Maps
      const encodedLocation = encodeURIComponent(item.value);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
    }
  }
}


