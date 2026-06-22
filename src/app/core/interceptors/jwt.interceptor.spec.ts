import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { jwtInterceptor } from './jwt.interceptor';

describe('jwtInterceptor', () => {
  let http: HttpClient; let ctrl: HttpTestingController;
  beforeEach(() => {
    localStorage.setItem('ecowatt_token', 'TOKEN123');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([jwtInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient); ctrl = TestBed.inject(HttpTestingController);
  });

  it('injeta Authorization quando há token', () => {
    http.get('/api/residencias').subscribe();
    const req = ctrl.expectOne('/api/residencias');
    expect(req.request.headers.get('Authorization')).toBe('Bearer TOKEN123');
    req.flush([]);
  });
});
