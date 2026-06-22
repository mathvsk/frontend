import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<div class="rounded-[--radius-card] border border-[--color-border] bg-[--color-card] p-4"><ng-content /></div>`,
})
export class UiCard {}
