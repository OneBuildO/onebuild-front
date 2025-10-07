import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { TelaCadastroComponent } from './tela-cadastro/tela-cadastro.component';
import { TelaRecuperarSenhaComponent } from './tela-recuperar-senha/tela-recuperar-senha.component';
import { TemplateModule } from './template/template.module';
import { SistemaModule } from './sistema/sistema.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/services/auth.service';
import { TokenInterceptor } from './services/security/token.interceptor';
import { LayoutComponent } from './layout/layout.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule }   from '@angular/material/core';
import { DetalhesProgressoProjetoComponent } from './sistema/servicos/cliente/detalhes-progresso-projeto/detalhes-progresso-projeto.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskModule } from 'ngx-mask';
import { BotTiComponent } from './sistema/suporte/bot-ti/bot-ti.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TelaCadastroComponent,
    TelaRecuperarSenhaComponent,
    LayoutComponent,
    DetalhesProgressoProjetoComponent,
    BotTiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TemplateModule,
    SistemaModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

