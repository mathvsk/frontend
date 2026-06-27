import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { lucideTrash2 } from '@ng-icons/lucide';
import { UiConfirmDialog } from './ui-confirm-dialog';

function botoes(fixture: ComponentFixture<UiConfirmDialog>): HTMLButtonElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('button'));
}

describe('UiConfirmDialog', () => {
  let fixture: ComponentFixture<UiConfirmDialog>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideIcons({ lucideTrash2 })] });
    fixture = TestBed.createComponent(UiConfirmDialog);
    fixture.componentRef.setInput('title', 'Remover leitura');
    fixture.componentRef.setInput('message', 'A leitura será removida.');
    fixture.detectChanges();
  });

  it('emite confirm ao clicar no botão de confirmar', () => {
    let confirmou = false;
    fixture.componentInstance.confirm.subscribe(() => (confirmou = true));
    const bts = botoes(fixture);
    bts[bts.length - 1].click();
    expect(confirmou).toBe(true);
  });

  it('emite cancel ao clicar em Cancelar', () => {
    let cancelou = false;
    fixture.componentInstance.cancel.subscribe(() => (cancelou = true));
    botoes(fixture)[0].click();
    expect(cancelou).toBe(true);
  });

  it('emite cancel ao pressionar Esc', () => {
    let cancelou = false;
    fixture.componentInstance.cancel.subscribe(() => (cancelou = true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cancelou).toBe(true);
  });

  it('usa o rótulo de confirmação informado', () => {
    fixture.componentRef.setInput('confirmLabel', 'Excluir');
    fixture.detectChanges();
    const bts = botoes(fixture);
    expect(bts[bts.length - 1].textContent?.trim()).toBe('Excluir');
  });
});
