import { Directive, ElementRef, effect, inject, input, untracked } from '@angular/core';

/** Interpolação com easeOutCubic; progresso fora de [0,1] é "clampado". */
export function valorAnimado(de: number, ate: number, progresso: number): number {
  const p = Math.min(1, Math.max(0, progresso));
  const eased = 1 - Math.pow(1 - p, 3);
  return de + (ate - de) * eased;
}

@Directive({ selector: '[appCountUp]' })
export class CountUpDirective {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  valor = input.required<number>({ alias: 'appCountUp' });
  duracao = input(600);
  private atual = 0;

  constructor() {
    effect((onCleanup) => {
      const destino = this.valor();
      const dur = untracked(() => this.duracao());
      const semMovimento = typeof matchMedia !== 'undefined'
        && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (semMovimento || typeof requestAnimationFrame === 'undefined') {
        this.render(destino);
        this.atual = destino;
        return;
      }
      const de = this.atual;
      const inicio = performance.now();
      let rafId = 0;
      const passo = (t: number) => {
        const progresso = (t - inicio) / dur;
        this.render(valorAnimado(de, destino, progresso));
        if (progresso < 1) {
          rafId = requestAnimationFrame(passo);
        } else {
          this.atual = destino;
        }
      };
      rafId = requestAnimationFrame(passo);
      onCleanup(() => cancelAnimationFrame(rafId));
    });
  }

  private render(v: number): void {
    this.el.nativeElement.textContent = String(Math.round(v));
  }
}
