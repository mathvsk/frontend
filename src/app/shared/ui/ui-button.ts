import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button [type]="type()" [disabled]="disabled()"
      class="w-full min-h-[48px] rounded-field px-4 text-[15px] font-medium transition active:scale-95"
      [class]="variant() === 'primary'
        ? 'bg-primary text-on-primary hover:brightness-110 disabled:opacity-50 disabled:active:scale-100'
        : 'border border-border text-content hover:bg-surface active:bg-surface'">
      <ng-content />
    </button>`,
})
export class UiButton {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'ghost'>('primary');
  disabled = input(false);
}
