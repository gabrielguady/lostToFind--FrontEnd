import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'home',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm = ''


  constructor(private router: Router){}

}




