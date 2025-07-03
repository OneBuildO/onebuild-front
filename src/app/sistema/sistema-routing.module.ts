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
import { VisualizarProjetoComponent } from './servicos/visualizar-projeto/visualizar-projeto.component';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { PainelArquitetoComponent } from './dashboards/painel-arquiteto/painel-arquiteto.component';
import { PainelConstrutorasComponent } from './dashboards/painel-construtoras/painel-construtoras.component';
import { PainelDesignsDeInterioresComponent } from './dashboards/painel-designs-de-interiores/painel-designs-de-interiores.component';
import { NotificacoesComponent } from './servicos/notificacoes/notificacoes.component';
import { AgendaDeProcessosComponent } from './servicos/agenda-de-processos/agenda-de-processos.component';
import { AtividadesComponent } from './servicos/atividades/atividades.component';
import { AquivosDoProjetoClienteComponent } from './servicos/cliente/aquivos-do-projeto-cliente/aquivos-do-projeto-cliente.component';
import { HistoricoDeStatusComponent } from './servicos/cliente/historico-de-status/historico-de-status.component';
import { ApresentacaoProjetoComponent } from './servicos/cliente/apresentacao-projeto/apresentacao-projeto.component';
import { VisualizarPromocoesComponent } from './servicos/visualizar-promocoes/visualizar-promocoes.component';
import { CadastroPromocoesComponent } from './servicos/cadastro-promocoes/cadastro-promocoes.component';
import { VisualizarPromocoesGeralComponent } from './servicos/visualizar-promocoes-geral/visualizar-promocoes-geral.component';
import { DetalhesClienteComponent } from './servicos/detalhes/detalhes-cliente/detalhes-cliente.component';
import { DetalhesProjetoComponent } from './servicos/detalhes/detalhes-projeto/detalhes-projeto.component';

const routes: Routes = [
  {
    path: 'usuario',
    component: LayoutComponent,
    canActivate: [AuthGuard],  
    children: [
      {path:'dashboard-admin', component:PainelAdminComponent},
      {path:'dashboard-cliente', component: PainelClientesComponent},
      {path:'dashboard-fornecedor', component: PainelFornecedorComponent},
      {path:'dashboard-arquiteto', component: PainelArquitetoComponent},
      {path:'dashboard-contrutora', component: PainelConstrutorasComponent},
      {path:'dashboard-design-de-interior', component: PainelDesignsDeInterioresComponent},

      // arquiteto
      {path:'agenda-de-processos', component: AgendaDeProcessosComponent},
      {path:'atividades-da-obra', component: AtividadesComponent},

      // cliente
      {path:'arquivos-da-obra', component: AquivosDoProjetoClienteComponent},
      {path:'historico-de-movimentacao', component: HistoricoDeStatusComponent},
      {path:'apresentacao-do-projeto', component: ApresentacaoProjetoComponent},
      {path:'apresentacao-do-projeto/:id', component: DetalhesProjetoComponent},


      {path:'meu-perfil', component: MeuPerfilComponent},
      {path:'notificacoes', component: NotificacoesComponent},
      // servicos
      {path:'cadastro-cliente', component: CadastroClientesComponent},
      {path:'cadastro-cliente/:id', component: CadastroClientesComponent},
      {path:'cadastro-projeto', component: CadastroProjetoComponent},
      {path:'cadastro-projeto/:id', component: CadastroProjetoComponent},
      {path:'cadastro-de-promocoes', component: CadastroPromocoesComponent},
      {path:'cadastro-de-promocoes/:id', component: CadastroPromocoesComponent},
      {path:'visualizar-clientes', component: VisualizarClientesComponent},
      {path:'visualizar-fornecedores', component: VisualizarFornecedoresComponent},
      {path:'visualizar-promocoes', component: VisualizarPromocoesComponent},
      {path:'painel-geral-de-promoções', component: VisualizarPromocoesGeralComponent},
      {path:'visualizar-projeto', component: VisualizarProjetoComponent},

      //visualizacao detalhada
      {path:'detalhes-cliente/:id', component: DetalhesClienteComponent},
      {path:'detalhes-projeto/:id', component: DetalhesProjetoComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
