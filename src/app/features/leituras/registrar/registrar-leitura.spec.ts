import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LeituraService } from '../../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { RegistrarLeituraPage } from './registrar-leitura';

describe('RegistrarLeituraPage', () => {
  const leitura = { registrar: vi.fn(() => of({ id: 1, consumoKwh: 180, custoEstimado: 165.6 })) };
  const sel = { atual: () => ({ id: 5, apelido: 'Casa', bairro: 'Batel', cidade: 'Curitiba' }) };
  beforeEach(() => { vi.clearAllMocks();
    TestBed.configureTestingModule({ providers: [
      { provide: LeituraService, useValue: leitura },
      { provide: ResidenciaSelecionadaService, useValue: sel },
    ] });
  });

  it('envia leitura manual com valor do medidor', () => {
    const cmp = TestBed.createComponent(RegistrarLeituraPage).componentInstance;
    cmp.origem.set('Manual'); cmp.valorMedidor.set(1500); cmp.mes.set(5); cmp.ano.set(2026);
    cmp.salvar();
    expect(leitura.registrar).toHaveBeenCalledWith(5, expect.objectContaining({ origem: 'Manual', valorMedidor: 1500, mesReferencia: 5, anoReferencia: 2026 }));
    expect(cmp.resultado()?.consumoKwh).toBe(180);
  });
});
