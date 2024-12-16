import {Component, EventEmitter, input, Input, Output} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-default-login-layout',
  standalone: true,
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.css'
})
export class DefaultLoginLayoutComponent {
  @Input() title: string='';
  @Input() primaryBtnText: string='';
  @Input() isDisabled: boolean = false;
  @Input() secondaryBtnText: string='';
  @Output("submit") onSubmit = new EventEmitter();
  @Output("navigate") onNavigate = new EventEmitter();

  navigate(){
    this.onNavigate.emit();
  }
  submit(){
    this.onSubmit.emit();
  }
}
