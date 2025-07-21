import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelAdminComponent } from './dashboards/painel-admin/painel-admin.component';
import { PainelClientesComponent } from './dashboards/painel-clientes/painel-clientes.component';
import { PainelFornecedorComponent } from './dashboards/painel-fornecedor/painel-fornecedor.component';
import { VisualizarClientesComponent } from './servicos/visualizar-clientes/visualizar-clientes.component';
import { CadastroClientesComponent } from './servicos/cadastro-clientes/cadastro-clientes.component';
import { CadastroProjetoComponent } from './servicos/cadastro-projeto/cadastro-projeto.component';
import { VisualizarProjetoComponent } from './servicos/visualizar-projeto/visualizar-projeto.component';
import { VisualizarFornecedoresComponent } from './servicos/visualizar-fornecedores/visualizar-fornecedores.component';
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
import { CadastroPromocoesComponent } from './servicos/cadastro-promocoes/cadastro-promocoes.component';
import { VisualizarPromocoesComponent } from './servicos/visualizar-promocoes/visualizar-promocoes.component';
import { VisualizarPromocoesGeralComponent } from './servicos/visualizar-promocoes-geral/visualizar-promocoes-geral.component';
import { DetalhesClienteComponent } from './servicos/detalhes/detalhes-cliente/detalhes-cliente.component';
import { DetalhesProjetoComponent } from './servicos/detalhes/detalhes-projeto/detalhes-projeto.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {  LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
registerLocaleData(localePt);

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
    MeuPerfilComponent,
    PainelArquitetoComponent,
    NotificacoesComponent,
    PainelConstrutorasComponent,
    PainelDesignsDeInterioresComponent,
    AgendaDeProcessosComponent,
    AtividadesComponent,
    AquivosDoProjetoClienteComponent,
    HistoricoDeStatusComponent,
    ApresentacaoProjetoComponent,
    CadastroPromocoesComponent,
    VisualizarPromocoesComponent,
    VisualizarPromocoesGeralComponent,
    DetalhesClienteComponent,
    DetalhesProjetoComponent
  ],
  imports: [
    BrowserModule,    
    FormsModule,      
    DragDropModule,   
    CommonModule,
    SistemaRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
  ],
    providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ],
})
export class SistemaModule { }
