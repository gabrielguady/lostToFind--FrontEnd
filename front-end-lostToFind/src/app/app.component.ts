import {Component} from '@angular/core';
import {NavigationExtras, Router, RouterOutlet} from '@angular/router';
import {MatButtonModule} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from '@angular/common';
import {LoginService} from '../shared/services/login.service';
import {jwtDecode} from 'jwt-decode';

interface Menu {
  title: string;
  route: string;
  isCurrent: boolean;
}


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, MatButtonModule, MatIcon, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public menuList: Menu[];

  private router: Router = new Router();

  constructor() {
    this.menuList = [
      {title: 'ITEM LOST', route: '/lost_item', isCurrent: false},
      {title: 'ITEM FOUND', route: '/found_item', isCurrent: false},
      {title: 'MY ITEMS', route: '/my_items', isCurrent: false},
    ];
    this.changeMenu(this.menuList[0]);
  }

  public changeMenu(menu: Menu): void {
    this.menuList.forEach((m: Menu) => {
      m.isCurrent = m.route === menu.route;
    });
    this.goToPage(menu.route);
  }

  public goToPage(route: string): void {
    const extras: NavigationExtras = {queryParamsHandling: 'merge'};
    this.router.navigate([route], extras).then();
  }

  public getToken(): string | null {
    return sessionStorage.getItem('access');
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  public logout(): void {

    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
  }

}
