import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-text-field',
  template: `
    <label class="block">
      <span class="mb-2 block text-[12px] font-medium text-muted">{{ label() }}</span>
      <input [type]="type()" [placeholder]="placeholder()" [value]="value()"
        (input)="value.set($any($event.target).value)"
        class="h-12 w-full rounded-field border border-border bg-surface px-3 text-[16px] text-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
      @if (erro()) { <span class="mt-1 block text-[12px] text-danger">{{ erro() }}</span> }
    </label>`,
})
export class UiTextField {
  label = input('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input('');
  erro = input<string | null>(null);
  value = model('');
}
