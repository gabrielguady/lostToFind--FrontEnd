import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Card} from 'primeng/card';
import {PrimeTemplate} from 'primeng/api';
import {NgForOf, NgIf} from '@angular/common';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Card,
    PrimeTemplate,
    NgIf,
    NgForOf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  searchTerm = ''
  messages: string[] = [];
  newMessage: string = '';

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

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.messages.push(this.newMessage.trim());
    this.newMessage = '';
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


