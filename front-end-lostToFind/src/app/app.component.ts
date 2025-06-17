import {Component} from '@angular/core';
import {NavigationExtras, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatIcon, MatIconButton, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // public menuList: Menu[];
  constructor(private router: Router) {}

  public navigate(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }

  getCurrentRoute(): string {
    const url = this.router.url.split('?')[0]; // Remove query params
    const segments = url.split('/').filter(Boolean);
    return segments[0] || '';
  }
}

