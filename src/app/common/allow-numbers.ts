import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numbersOnly]',
})
export class NumbersOnlyDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const pattern = /^[0-9]*$/;
    const inputValue = event.target.value;

    if (!pattern.test(inputValue)) {
      event.target.value = inputValue.replace(/[^0-9]/g, '');
    }
  }
}
