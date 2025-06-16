import {Component} from '@angular/core';
import {NavigationExtras, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle} from '@angular/material/button-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, MatIcon, MatIconButton, RouterLink, RouterLinkActive, MatButtonToggle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // public menuList: Menu[];
  private router: Router;

  public navigate(route: string): void {
    const extras: NavigationExtras = { queryParamsHandling: 'merge' };
    this.router.navigate([route], extras).then();
  }
}

