import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelAdminComponent } from './dashboards/painel-admin/painel-admin.component';
import { PainelClientesComponent } from './dashboards/painel-clientes/painel-clientes.component';
import { PainelFornecedorComponent } from './dashboards/painel-fornecedor/painel-fornecedor.component';
import { VisualizarClientesComponent } from './servicos/visualizar-clientes/visualizar-clientes.component';
import { CadastroClientesComponent } from './servicos/cadastro-clientes/cadastro-clientes.component';
import { CadastroProjetoComponent } from './servicos/cadastro-projeto/cadastro-projeto.component';
import { VisualizarProjetoComponent } from './servicos/visualizar-projeto/visualizar-projeto.component';
import { VisualizarFornecedoresComponent } from './servicos/visualizar-fornecedores/visualizar-fornecedores.component';
import { VisualizarOportunidadesComponent } from './servicos/visualizar-oportunidades/visualizar-oportunidades.component';
import { SharedModule } from '../shared/shared.module';
import { MeuPerfilComponent } from './meu-perfil/meu-perfil.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PainelArquitetoComponent } from './dashboards/painel-arquiteto/painel-arquiteto.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { NotificacoesComponent } from './servicos/notificacoes/notificacoes.component';
import { PainelConstrutorasComponent } from './dashboards/painel-construtoras/painel-construtoras.component';
import { PainelDesignsDeInterioresComponent } from './dashboards/painel-designs-de-interiores/painel-designs-de-interiores.component';
import { AgendaDeProcessosComponent } from './servicos/agenda-de-processos/agenda-de-processos.component';
import { AtividadesComponent } from './servicos/atividades/atividades.component';
import { AquivosDoProjetoClienteComponent } from './servicos/cliente/aquivos-do-projeto-cliente/aquivos-do-projeto-cliente.component';
import { HistoricoDeStatusComponent } from './servicos/cliente/historico-de-status/historico-de-status.component';
import { ApresentacaoProjetoComponent } from './servicos/cliente/apresentacao-projeto/apresentacao-projeto.component';


@NgModule({
  declarations: [
    PainelAdminComponent,
    PainelClientesComponent,
    PainelFornecedorComponent,
    VisualizarClientesComponent,
    CadastroClientesComponent,
    CadastroProjetoComponent,
    VisualizarProjetoComponent,
    VisualizarFornecedoresComponent,
    VisualizarOportunidadesComponent,
    MeuPerfilComponent,
    PainelArquitetoComponent,
    NotificacoesComponent,
    PainelConstrutorasComponent,
    PainelDesignsDeInterioresComponent,
    AgendaDeProcessosComponent,
    AtividadesComponent,
    AquivosDoProjetoClienteComponent,
    HistoricoDeStatusComponent,
    ApresentacaoProjetoComponent
  ],
  imports: [
    CommonModule,
    SistemaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    FormsModule
  ]
})
export class SistemaModule { }
