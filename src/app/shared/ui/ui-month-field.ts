import { Component, ElementRef, computed, inject, input, model, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { mesAnoDeInput, mesAnoParaInput } from '../../core/utils/mes-ano';

const MESES_ABREV = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MESES_NOME = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

@Component({
  selector: 'app-month-field',
  imports: [NgIcon],
  host: {
    '(document:click)': 'aoClicarFora($event)',
    '(document:keydown.escape)': 'aberto.set(false)',
  },
  template: `
    <div class="relative">
      <span class="mb-2 block text-[12px] font-medium text-muted">{{ label() }}</span>
      <button type="button" (click)="alternar()" [attr.aria-expanded]="aberto()" aria-haspopup="dialog"
        class="flex h-12 w-full items-center justify-between rounded-field border bg-surface px-3 text-[16px] text-content outline-none transition"
        [class]="aberto() ? 'border-primary ring-2 ring-primary/30' : 'border-border'">
        <span [class.text-muted]="!selecionado()">{{ rotulo() }}</span>
        <ng-icon name="lucideCalendar" size="18" class="text-muted" />
      </button>

      @if (aberto()) {
        <div role="dialog" aria-label="Selecionar mês"
          class="absolute left-0 right-0 z-20 mt-1 rounded-card border border-border bg-card p-3 animate-in fade-in zoom-in-95 duration-150">
          <div class="mb-2 flex items-center justify-between">
            <button type="button" (click)="anoVisivel.set(anoVisivel() - 1)" aria-label="Ano anterior"
              class="flex h-9 w-9 items-center justify-center rounded-field text-muted transition hover:bg-surface active:scale-95">
              <ng-icon name="lucideChevronLeft" size="18" />
            </button>
            <span class="text-[15px] font-medium">{{ anoVisivel() }}</span>
            <button type="button" (click)="anoVisivel.set(anoVisivel() + 1)" aria-label="Próximo ano"
              class="flex h-9 w-9 items-center justify-center rounded-field text-muted transition hover:bg-surface active:scale-95">
              <ng-icon name="lucideChevronRight" size="18" />
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            @for (m of meses; track m.numero) {
              <button type="button" (click)="selecionar(m.numero)"
                class="min-h-[44px] rounded-field text-[13px] font-medium transition active:scale-95"
                [class]="ehSelecionado(m.numero) ? 'bg-primary text-on-primary' : 'text-content hover:bg-surface'">
                {{ m.abrev }}
              </button>
            }
          </div>
        </div>
      }
    </div>`,
})
export class UiMonthField {
  label = input('');
  placeholder = input('Selecione o mês');
  value = model<string>('');

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  aberto = signal(false);
  anoVisivel = signal(new Date().getFullYear());
  meses = MESES_ABREV.map((abrev, i) => ({ numero: i + 1, abrev }));

  private referencia = computed(() => mesAnoDeInput(this.value()));
  selecionado = computed(() => this.referencia() !== null);
  rotulo = computed(() => {
    const r = this.referencia();
    return r ? `${MESES_NOME[r.mes - 1]} ${r.ano}` : this.placeholder();
  });

  alternar(): void {
    if (!this.aberto()) {
      const r = this.referencia();
      this.anoVisivel.set(r ? r.ano : new Date().getFullYear());
    }
    this.aberto.update((v) => !v);
  }

  selecionar(mes: number): void {
    this.value.set(mesAnoParaInput(mes, this.anoVisivel()));
    this.aberto.set(false);
  }

  ehSelecionado(mes: number): boolean {
    const r = this.referencia();
    return r !== null && r.mes === mes && r.ano === this.anoVisivel();
  }

  aoClicarFora(evento: Event): void {
    if (this.aberto() && !this.host.nativeElement.contains(evento.target as Node)) {
      this.aberto.set(false);
    }
  }
}
