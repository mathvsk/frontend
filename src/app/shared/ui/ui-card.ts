import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  host: { class: 'block' },
  template: `<div class="rounded-card border border-border bg-card p-4 animate-in fade-in slide-in-from-bottom-2 duration-300"><ng-content /></div>`,
})
export class UiCard {}
