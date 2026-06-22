import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MetaService } from './meta.service';

describe('MetaService', () => {
  let service: MetaService; let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MetaService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(MetaService); http = TestBed.inject(HttpTestingController);
  });
  it('atual faz GET com mes/ano', () => {
    service.atual(5, 5, 2026).subscribe();
    const req = http.expectOne('/api/residencias/5/metas/atual?mes=5&ano=2026');
    expect(req.request.method).toBe('GET'); req.flush({ id: 1, limiteKwh: 190, mediaRegionalKwh: 180 });
  });
  it('definir faz POST', () => {
    service.definir(5, { mesReferencia: 5, anoReferencia: 2026, limiteKwh: 190, percentualAlerta: 0.8 }).subscribe();
    const req = http.expectOne('/api/residencias/5/metas');
    expect(req.request.method).toBe('POST'); req.flush({ id: 1, limiteKwh: 190, mediaRegionalKwh: 180 });
  });
});
