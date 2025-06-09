import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {URLS} from '../../../shared/urls';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LostItem} from '../../../shared/models/lost-item';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {BaseComponent} from '../../base-component';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, provideNativeDateAdapter} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatTooltip} from '@angular/material/tooltip';
import {NgIf} from '@angular/common';
import {AddPhotoComponent} from '../../add-photo-lost/add-photo.component';

@Component({
  selector: 'app-lost-item-create',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    AutofocusDirective,
    MatButtonModule,
    ReactiveFormsModule,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSelect,
    MatOption,
    NgIf,
    AddPhotoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
  templateUrl: './lost-item-create.component.html',
  styleUrl: './lost-item-create.component.css'
})
export class LostItemCreateComponent extends BaseComponent<LostItem> implements OnInit {
  public formGroup: FormGroup;
  public object: LostItem = new LostItem();
  @Output() itemIdEmitter: EventEmitter<any> = new EventEmitter<any>();
  public categories: { value: number, label: string }[] = [
    { value: 1, label: 'Acessórios' },
    { value: 2, label: 'Documentos pessoais' },
    { value: 3, label: 'Eletrônicos' },
    { value: 4, label: 'Cartão de crédito' },
    { value: 5, label: 'Pets' },
    { value: 6, label: 'Outros' },
  ];

  private formatDate(date: Date | string): string {
    if (!date) return '';

    // Se já for string, retorna ela mesma (assumindo que já esteja formatada)
    if (typeof date === 'string') {
      return date;
    }

    // Se for Date, formata no padrão dd/MM/yyyy HH:mm
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, '0');
    const min = date.getMinutes().toString().padStart(2, '0');

    return `${d}/${m}/${y} ${h}:${min}`;
  }


  constructor(private http: HttpClient) {
    super(http,URLS.LOST_ITEM)
  }


  ngOnInit(): void {
    this.formGroup = new FormGroup({
      title : new FormControl('', [Validators.required]),
      last_seen_details : new FormControl('', [Validators.required]),
      date_lost : new FormControl('', [Validators.required]),
      reward : new FormControl('', [Validators.required]),
      category : new FormControl('', [Validators.required]),
      city : new FormControl('', [Validators.required]),
    })
  }


  public saveOrUpdate(): void {
    if (this.formGroup.valid) {
      Object.keys(this.formGroup.controls).forEach(key => {
        let value = this.formGroup.getRawValue()[key];

        // Se for campo date_lost e for Date, formata para string no formato dd/MM/yyyy HH:mm
        if (key === 'date_lost' && value) {
          value = this.formatDate(value);
        }

        if (value !== null && value !== undefined) {
          this.object[key] = value;
        }
      });

      this.service.save(this.object).subscribe({
        next: (response: LostItem) => {
          this.object = response;
          console.log('Item salvo com sucesso:', response);
          // Aqui você pode emitir eventos ou resetar o form se quiser
        },
        error: (err) => {
          console.error('Erro ao salvar item:', err);
        }
      });
    } else {
      console.warn('Formulário inválido, corrija os erros.');
    }
  }

}
