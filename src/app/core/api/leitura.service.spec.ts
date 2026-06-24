import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { LeituraService } from './leitura.service';

describe('LeituraService', () => {
  let service: LeituraService; let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LeituraService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(LeituraService); http = TestBed.inject(HttpTestingController);
  });

  it('atualizar faz PUT na url da leitura', () => {
    service.atualizar(5, 9, { mesReferencia: 5, anoReferencia: 2026, origem: 'Fatura', consumoKwh: 200, valorFatura: 300 }).subscribe();
    const req = http.expectOne('/api/residencias/5/leituras/9');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.valorFatura).toBe(300);
    req.flush({ id: 9, consumoKwh: 200, custoEstimado: 300 });
  });

  it('remover faz DELETE na url da leitura', () => {
    service.remover(5, 9).subscribe();
    const req = http.expectOne('/api/residencias/5/leituras/9');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
