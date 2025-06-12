import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { TelaRecuperarSenhaComponent } from './tela-recuperar-senha/tela-recuperar-senha.component';
import { LayoutComponent } from './layout/layout.component';
import { PainelAdminComponent } from './sistema/dashboards/painel-admin/painel-admin.component';
import { TelaCadastroComponent } from './tela-cadastro/tela-cadastro.component';
import { AuthGuard } from './services/security/auth.guard';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-de-usuario', component: TelaCadastroComponent },
  { path: 'recuperacao-de-senha', component: TelaRecuperarSenhaComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'usuario/painel-principal-admin',
        component: PainelAdminComponent,
        canActivate: [AuthGuard] 
      },
      { path: '', redirectTo: 'usuario/painel-principal-admin', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    SharedModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
