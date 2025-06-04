import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelAdminComponent } from './dashboards/painel-admin/painel-admin.component';
import { PainelProfissionaisComponent } from './dashboards/painel-profissionais/painel-profissionais.component';


@NgModule({
  declarations: [
    PainelAdminComponent,
    PainelProfissionaisComponent
  ],
  imports: [
    CommonModule,
    SistemaRoutingModule
  ]
})
export class SistemaModule { }
