import { Component, computed, input, model } from '@angular/core';
import { formatarMoedaBR, digitosParaValor } from '../../core/utils/moeda';

@Component({
  selector: 'app-currency-field',
  template: `
    <label class="block">
      <span class="mb-2 block text-[12px] font-medium text-muted">{{ label() }}</span>
      <input type="text" inputmode="numeric" [placeholder]="placeholder()" [value]="textoExibido()"
        (input)="aoDigitar($any($event.target).value)"
        class="h-12 w-full rounded-field border border-border bg-surface px-3 text-[16px] text-content outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30" />
    </label>`,
})
export class UiCurrencyField {
  label = input('');
  placeholder = input('R$ 0,00');
  value = model<number | null>(null);

  textoExibido = computed(() => {
    const v = this.value();
    return v === null ? '' : formatarMoedaBR(v);
  });

  aoDigitar(texto: string): void {
    this.value.set(digitosParaValor(texto));
  }
}
