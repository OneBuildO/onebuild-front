import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

@Component({
  selector: 'app-apresentacao-projeto',
  templateUrl: './apresentacao-projeto.component.html',
  styleUrls: ['./apresentacao-projeto.component.css']
})
export class ApresentacaoProjetoComponent implements OnInit {

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
