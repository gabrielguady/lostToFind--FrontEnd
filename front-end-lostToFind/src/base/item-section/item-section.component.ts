import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseService} from '../../shared/services/base.service';
import {FoundItem} from '../../shared/models/found-item';
import {HttpParams} from '@angular/common/http';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-item-section',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './item-section.component.html',
  styleUrl: './item-section.component.css'
})
export class ItemSectionComponent implements OnInit {
  itemId: number | null = null;
  item: FoundItem | null = null;

  parameters: HttpParams = new HttpParams();

  constructor(private route: ActivatedRoute, private itemService: BaseService<FoundItem>) {}

  ngOnInit(): void {
    // Pega o ID da URL e converte para número
    this.itemId = +this.route.snapshot.paramMap.get('id')!; // O operador '+' converte a string em número

    if (this.itemId) {
      // Chama o serviço para buscar os detalhes do item
      this.itemService.getById(this.itemId).subscribe(
        (data) => {
          this.item = data;  // Atribui os dados ao item
        },
        (error) => {
          console.error('Erro ao buscar item', error);
        }
      );
    } else {
      console.error('ID inválido na URL');
    }
  }
}
