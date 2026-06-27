import { Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [NgIcon],
  host: { '(document:keydown.escape)': 'cancel.emit()' },
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in duration-200"
      role="dialog" aria-modal="true" [attr.aria-label]="title()" (click)="cancel.emit()">
      <div
        class="w-full max-w-[340px] rounded-sheet border border-border bg-card p-6 animate-in fade-in zoom-in-95 duration-200"
        (click)="$event.stopPropagation()">
        <div class="mb-3 flex items-center gap-3">
          <span class="flex h-10 w-10 flex-none items-center justify-center rounded-full"
            [class]="variant() === 'danger' ? 'bg-danger/15 text-danger' : 'bg-primary/15 text-primary'">
            <ng-icon [name]="icon()" size="20"></ng-icon>
          </span>
          <p class="text-h2 font-medium">{{ title() }}</p>
        </div>
        <p class="mb-5 text-[14px] leading-relaxed text-muted">{{ message() }}</p>
        <div class="flex gap-2.5">
          <button type="button" (click)="cancel.emit()"
            class="min-h-[44px] flex-1 rounded-field border border-border px-4 text-[14px] font-medium text-content transition hover:bg-surface active:scale-95">
            Cancelar
          </button>
          <button #confirmBtn type="button" (click)="confirm.emit()"
            class="min-h-[44px] flex-1 rounded-field px-4 text-[14px] font-medium transition hover:brightness-110 active:scale-95"
            [class]="variant() === 'danger' ? 'bg-danger text-on-danger' : 'bg-primary text-on-primary'">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>`,
})
export class UiConfirmDialog {
  title = input.required<string>();
  message = input.required<string>();
  confirmLabel = input('Remover');
  variant = input<'danger' | 'primary'>('danger');
  icon = input('lucideTrash2');

  confirm = output<void>();
  cancel = output<void>();

  private confirmBtn = viewChild<ElementRef<HTMLButtonElement>>('confirmBtn');

  constructor() {
    afterNextRender(() => this.confirmBtn()?.nativeElement.focus());
  }
}
