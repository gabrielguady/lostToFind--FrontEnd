import { AfterViewInit, Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  private static isFirstFocusApplied = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (!AutofocusDirective.isFirstFocusApplied) {
      this.el.nativeElement.focus();
      AutofocusDirective.isFirstFocusApplied = true;
    }
  }
}
