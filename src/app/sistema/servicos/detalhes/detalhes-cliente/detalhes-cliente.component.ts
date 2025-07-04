import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/services/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteProjetoDTO } from '../../visualizar-clientes/cliente-projeto-dto';
import { StatusDoProjeto } from '../../cadastro-projeto/statusDoProjeto';
import { StatusDoProjetoDescricoes } from '../../cadastro-projeto/statusDoProjetoDescricoes';
import { stat } from 'fs';

@Component({
  selector: 'app-detalhes-cliente',
  templateUrl: './detalhes-cliente.component.html',
  styleUrls: ['./detalhes-cliente.component.css']
})
export class DetalhesClienteComponent implements OnInit {

  cliente: ClienteProjetoDTO | null = null;
  carregando:boolean = false;

  constructor(private clienteService: ClienteService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.router.snapshot.paramMap.get('id');
    if (id) {
      this.carregarCliente(id);
    }
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  carregarCliente(id: string): void {
    this.carregando = true;
    this.clienteService.getClientById(id).subscribe({
      next: (res) => {
        this.cliente = res;
        this.carregando = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  traduzirStatusDoProjeto(statusProjeto: string) {
    const statusDoProjetoTraduzido = StatusDoProjetoDescricoes[statusProjeto as StatusDoProjeto];
    
    return statusDoProjetoTraduzido;
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // Rosa pastel
      '#FFDFBA', // Laranja pastel
      '#BAFFC9', // Verde pastel
      '#BAE1FF', // Azul pastel
      '#D5BAFF', // Roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }


}