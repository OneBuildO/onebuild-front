import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { AuthGuard } from '../services/security/auth.guard';
import { PainelAdminComponent } from './dashboards/painel-admin/painel-admin.component';
import { PainelClientesComponent } from './dashboards/painel-clientes/painel-clientes.component';
import { PainelFornecedorComponent } from './dashboards/painel-fornecedor/painel-fornecedor.component';
import { CadastroClientesComponent } from './servicos/cadastro-clientes/cadastro-clientes.component';
import { CadastroProjetoComponent } from './servicos/cadastro-projeto/cadastro-projeto.component';
import { VisualizarClientesComponent } from './servicos/visualizar-clientes/visualizar-clientes.component';
import { VisualizarFornecedoresComponent } from './servicos/visualizar-fornecedores/visualizar-fornecedores.component';
import { VisualizarOportunidadesComponent } from './servicos/visualizar-oportunidades/visualizar-oportunidades.component';
import { VisualizarProjetoComponent } from './servicos/visualizar-projeto/visualizar-projeto.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { PainelArquitetoComponent } from './dashboards/painel-arquiteto/painel-arquiteto.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: LayoutComponent,
     
    children: [
      {path:'dashboard-admin', component:PainelAdminComponent},
      {path:'dashboard-cliente', component: PainelClientesComponent},
      {path:'dashboard-fornecedor', component: PainelFornecedorComponent},
      {path:'dashboard-arquiteto', component: PainelArquitetoComponent},

      {path:'meu-perfil', component: MeuPerfilComponent},
      // servicos
      {path:'cadastro-cliente', component: CadastroClientesComponent},
      {path:'cadastro-cliente/:id', component: CadastroClientesComponent},
      {path:'cadastro-projeto', component: CadastroProjetoComponent},
      {path:'cadastro-projeto/:id', component: CadastroProjetoComponent},
      {path:'visualizar-clientes', component: VisualizarClientesComponent},
      {path:'visualizar-fornecedores', component: VisualizarFornecedoresComponent},
      {path:'visualizar-oportunidades', component: VisualizarOportunidadesComponent},
      {path:'visualizar-projeto', component: VisualizarProjetoComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
