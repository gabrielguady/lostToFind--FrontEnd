import { Component } from '@angular/core';
import {CommentsComponent} from "../../comments/comments.component";
import {DatePipe, DecimalPipe} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-found-item-details',
  standalone: true,
    imports: [
        CommentsComponent,
        DatePipe,
        DecimalPipe,
        MatCard,
        MatCardContent,
        MatIcon,
        MatIconButton
    ],
  templateUrl: './found-item-details.component.html',
  styleUrl: './found-item-details.component.scss'
})
export class FoundItemDetailsComponent {

}
