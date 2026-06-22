import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ResidenciaService } from './residencia.service';

describe('ResidenciaService', () => {
  let service: ResidenciaService; let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ResidenciaService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ResidenciaService); http = TestBed.inject(HttpTestingController);
  });

  it('listar faz GET /api/residencias', () => {
    service.listar().subscribe();
    const req = http.expectOne('/api/residencias');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('criar faz POST com o corpo', () => {
    service.criar({ apelido: 'Casa', bairro: 'Batel', cidade: 'Curitiba' }).subscribe();
    const req = http.expectOne('/api/residencias');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.apelido).toBe('Casa');
    req.flush({ id: 1, apelido: 'Casa', bairro: 'Batel', cidade: 'Curitiba' });
  });
});
