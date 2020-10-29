import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appTestChild]',
})
export class TestChildDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}