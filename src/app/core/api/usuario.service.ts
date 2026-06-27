import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsuarioPerfil, AtualizarPerfil, AtualizarPerfilResponse, AlterarSenha, FotoResponse } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/usuarios`;

  me() { return this.http.get<UsuarioPerfil>(`${this.base}/me`); }
  atualizarDados(dto: AtualizarPerfil) { return this.http.put<AtualizarPerfilResponse>(`${this.base}/me`, dto); }
  alterarSenha(dto: AlterarSenha) { return this.http.put<void>(`${this.base}/me/senha`, dto); }

  enviarFoto(file: File) {
    const form = new FormData();
    form.append('arquivo', file);
    return this.http.post<FotoResponse>(`${this.base}/me/foto`, form);
  }
}
