import {Component, Input} from '@angular/core';
import {MatCard, MatCardContent, MatCardImage, MatCardTitle} from '@angular/material/card';
import {DatePipe, NgIf, NgOptimizedImage} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {Router, RouterLink} from '@angular/router';
import {MatRadioButton} from '@angular/material/radio';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-add-photo-found',
  standalone: true,
  imports: [
    MatCard,
    DatePipe,
    MatButton,
    MatCardContent,
    MatCardImage,
    MatCardTitle,
    MatTooltip,
    RouterLink,
    NgOptimizedImage,
    NgIf,
    MatRadioButton,
  ],
  templateUrl: './add-photo-found.component.html',
  styleUrl: './add-photo-found.component.css'
})
export class AddPhotoComponent {
  @Input() id_item_found: number;
  selectedImage: File | null = null;
  private router: Router= new Router();


  constructor(private http: HttpClient) {
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        this.selectedImage = file;  // Armazenando o arquivo selecionado
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.selectedImage) {
      const formData = new FormData();
      console.log(this.id_item_found.toString())
      formData.append('file_obj', this.selectedImage);
      formData.append('id_item', this.id_item_found.toString());


      this.http.post('http://localhost:8000/api/core/found_item/upload_file/', formData)
        .subscribe(
          response => {
            console.log('Arquivo enviado com sucesso', response);
            this.router.navigate(['found_item']);          },
          error => {
            console.error('Erro ao enviar arquivo', error);
          }
        );
    }
  }

}
