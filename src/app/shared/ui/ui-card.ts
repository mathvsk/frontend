import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `<div class="rounded-card border border-border bg-card p-4"><ng-content /></div>`,
})
export class UiCard {}
