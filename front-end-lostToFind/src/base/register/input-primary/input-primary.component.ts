import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {AutofocusDirective} from '../../../shared/directives/auto-focus-directive';
import {NgIf} from '@angular/common';

type InputType = "text" | "password" | "email" | 'number';
@Component({
  selector: 'app-input-primary',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AutofocusDirective,
    NgIf,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputPrimaryComponent),
    multi: true
  }],
  templateUrl: './input-primary.component.html',
  styleUrl: './input-primary.component.css'
})
export class InputPrimaryComponent  implements ControlValueAccessor {
  @Input() type: InputType='text';
  @Input() placeholder: string = "";
  @Input() label: string = "";
  @Input() inputName: string = "";

  value: string='';
  onChange:  any= () => {};
  onTouch:  any= () => {};


  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }



}
