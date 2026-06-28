import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { UiMonthField } from './ui-month-field';

describe('UiMonthField', () => {
  let fixture: ComponentFixture<UiMonthField>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideIcons({ lucideCalendar, lucideChevronLeft, lucideChevronRight })],
    });
    fixture = TestBed.createComponent(UiMonthField);
  });

  it('mostra o placeholder quando não há valor', () => {
    fixture.componentRef.setInput('placeholder', 'Selecione o mês');
    fixture.detectChanges();
    expect(fixture.componentInstance.selecionado()).toBe(false);
    expect(fixture.componentInstance.rotulo()).toBe('Selecione o mês');
  });

  it('formata AAAA-MM como mês por extenso + ano', () => {
    fixture.componentRef.setInput('value', '2026-06');
    fixture.detectChanges();
    expect(fixture.componentInstance.rotulo()).toBe('Junho 2026');
  });

  it('seleciona um mês e emite AAAA-MM, fechando o popover', () => {
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    cmp.alternar();
    cmp.anoVisivel.set(2026);
    cmp.selecionar(3);
    expect(cmp.value()).toBe('2026-03');
    expect(cmp.aberto()).toBe(false);
  });

  it('destaca o mês/ano atualmente selecionado', () => {
    fixture.componentRef.setInput('value', '2026-06');
    fixture.detectChanges();
    const cmp = fixture.componentInstance;
    cmp.anoVisivel.set(2026);
    expect(cmp.ehSelecionado(6)).toBe(true);
    expect(cmp.ehSelecionado(7)).toBe(false);
    cmp.anoVisivel.set(2025);
    expect(cmp.ehSelecionado(6)).toBe(false);
  });
});
