import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

@Component({
  selector: 'app-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.css']
})
export class NotificacoesComponent implements OnInit {

  constructor(
      private router: Router,
      private clienteService: ClienteService,
      private authService: AuthService
    ) {}
          
        
    ngOnInit(): void {
    }
        
    onVoltarClick() {
      const rota = this.authService.getHomeRouteForRole();
      this.router.navigate([rota]);
    }
}
