import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelAdminComponent } from './dashboards/painel-admin/painel-admin.component';
import { PainelProfissionaisComponent } from './dashboards/painel-profissionais/painel-profissionais.component';
import { PainelClientesComponent } from './dashboards/painel-clientes/painel-clientes.component';
import { PainelFornecedorComponent } from './dashboards/painel-fornecedor/painel-fornecedor.component';
import { VisualizarClientesComponent } from './servicos/visualizar-clientes/visualizar-clientes.component';
import { CadastroClientesComponent } from './servicos/cadastro-clientes/cadastro-clientes.component';
import { CadastroProjetoComponent } from './servicos/cadastro-projeto/cadastro-projeto.component';
import { VisualizarProjetoComponent } from './servicos/visualizar-projeto/visualizar-projeto.component';
import { VisualizarFornecedoresComponent } from './servicos/visualizar-fornecedores/visualizar-fornecedores.component';
import { VisualizarOportunidadesComponent } from './servicos/visualizar-oportunidades/visualizar-oportunidades.component';
import { MeuPerfilComponent } from './servicos/meu-perfil/meu-perfil.component';


@NgModule({
  declarations: [
    PainelAdminComponent,
    PainelProfissionaisComponent,
    PainelClientesComponent,
    PainelFornecedorComponent,
    VisualizarClientesComponent,
    CadastroClientesComponent,
    CadastroProjetoComponent,
    VisualizarProjetoComponent,
    VisualizarFornecedoresComponent,
    VisualizarOportunidadesComponent,
    MeuPerfilComponent
  ],
  imports: [
    CommonModule,
    SistemaRoutingModule
  ]
})
export class SistemaModule { }
