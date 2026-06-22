import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'cadastro', loadComponent: () => import('./features/auth/cadastro/cadastro').then(m => m.Cadastro) },
  {
    path: '',
    loadComponent: () => import('./shared/layout/app-shell/app-shell').then(m => m.AppShell),
    canActivate: [authGuard],
    children: [
      { path: '', loadComponent: () => import('./features/dashboard/inicio/inicio').then(m => m.Inicio) },
      { path: 'historico', loadComponent: () => import('./features/historico/historico').then(m => m.Historico) },
      { path: 'residencias', loadComponent: () => import('./features/residencias/residencias').then(m => m.Residencias) },
      { path: 'leituras/registrar', loadComponent: () => import('./features/leituras/registrar/registrar-leitura').then(m => m.RegistrarLeituraPage) },
      { path: 'metas', loadComponent: () => import('./features/metas/definir/definir-meta').then(m => m.DefinirMeta) },
      { path: 'alertas', loadComponent: () => import('./features/alertas/alertas').then(m => m.Alertas) },
      { path: 'dicas', loadComponent: () => import('./features/dicas/dicas').then(m => m.Dicas) },
      { path: 'dicas/gerenciar', loadComponent: () => import('./features/dicas/dica-form').then(m => m.DicaForm), canActivate: [adminGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
