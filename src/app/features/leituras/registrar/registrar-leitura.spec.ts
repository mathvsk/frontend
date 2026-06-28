import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LeituraService } from '../../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { RegistrarLeituraPage } from './registrar-leitura';

describe('RegistrarLeituraPage', () => {
  const leitura = {
    registrar: vi.fn(() => of({ id: 1, consumoKwh: 180, custoEstimado: 165.6 })),
    atualizar: vi.fn(() => of({ id: 9, consumoKwh: 250, custoEstimado: 410 })),
  };
  const sel = { atual: () => ({ id: 5, apelido: 'Casa', bairro: 'Batel', cidade: 'Curitiba' }) };

  function configurar(idParam: string | null) {
    vi.clearAllMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [
      { provide: LeituraService, useValue: leitura },
      { provide: ResidenciaSelecionadaService, useValue: sel },
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => idParam } } } },
    ] });
  }

  it('cria via POST quando não há id', () => {
    configurar(null);
    const cmp = TestBed.createComponent(RegistrarLeituraPage).componentInstance;
    cmp.mesAno.set('2026-05'); cmp.consumo.set(210); cmp.valor.set(300);
    cmp.salvar();
    expect(leitura.registrar).toHaveBeenCalledWith(5, expect.objectContaining({ origem: 'Fatura', consumoKwh: 210, valorFatura: 300, mesReferencia: 5, anoReferencia: 2026 }));
    expect(leitura.atualizar).not.toHaveBeenCalled();
  });

  it('edita via PUT quando há id', () => {
    configurar('9');
    const cmp = TestBed.createComponent(RegistrarLeituraPage).componentInstance;
    cmp.mesAno.set('2026-05'); cmp.consumo.set(250); cmp.valor.set(410);
    cmp.salvar();
    expect(leitura.atualizar).toHaveBeenCalledWith(5, 9, expect.objectContaining({ origem: 'Fatura', consumoKwh: 250, valorFatura: 410 }));
    expect(leitura.registrar).not.toHaveBeenCalled();
  });

  it('bloqueia o POST quando o consumo está vazio', () => {
    configurar(null);
    const cmp = TestBed.createComponent(RegistrarLeituraPage).componentInstance;
    cmp.mesAno.set('2026-05'); cmp.consumo.set(null); cmp.valor.set(300);
    cmp.salvar();
    expect(leitura.registrar).not.toHaveBeenCalled();
    expect(cmp.erro()).toBeTruthy();
  });
});
