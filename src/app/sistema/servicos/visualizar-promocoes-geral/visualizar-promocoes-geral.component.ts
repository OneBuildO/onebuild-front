import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ClienteService } from 'src/app/services/services/cliente.service';

// Tipagem opcional
interface Anuncio {
  id: number;
  titulo: string;
  descricao: string;
  valor: number;
  validade: string | Date;
  imagemUrl?: string;
  isMeu?: boolean;
}
@Component({
  selector: 'app-visualizar-promocoes-geral',
  templateUrl: './visualizar-promocoes-geral.component.html',
  styleUrls: ['./visualizar-promocoes-geral.component.css']
})
export class VisualizarPromocoesGeralComponent implements OnInit {

  isModalOpen = false;

novaPromocao: {
  titulo: string;
  descricao: string;
  valor: number | null;
  validade: string | null;
  imagemArquivo: File | null;
  previewUrl: string | null;
} = {
  titulo: '',
  descricao: '',
  valor: null,
  validade: null,
  imagemArquivo: null,
  previewUrl: null
};

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

  anuncios: Anuncio[] = [
    { id: 1, titulo: 'Cadeira Gamer X', descricao: 'Couro PU, reclinável', valor: 899.9, validade: new Date(2025, 8, 30), imagemUrl: '/assets/imgs/placeholder.png', isMeu: false },
    { id: 2, titulo: 'Mesa Escritório', descricao: '120cm, MDF', valor: 499.0, validade: new Date(2025, 9, 15), imagemUrl: '/assets/imgs/placeholder.png', isMeu: true },
    { id: 3, titulo: 'Monitor 27”', descricao: '144Hz, IPS', valor: 1299.0, validade: new Date(2025, 9, 5), imagemUrl: '/assets/imgs/placeholder.png', isMeu: false },
  ];
  
  get meusAnuncios(): Anuncio[] {
    return this.anuncios.filter(a => a.isMeu);
  }
  
  abrirModal(){ this.isModalOpen = true; }
  fecharModal(){
    this.isModalOpen = false;
    // opcional: limpar formulário ao fechar
    this.novaPromocao = { titulo:'', descricao:'', valor:null, validade:null, imagemArquivo:null, previewUrl:null };
  }
  
  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if(!file) return;
    this.novaPromocao.imagemArquivo = file;
  
    const reader = new FileReader();
    reader.onload = () => this.novaPromocao.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }
  
  salvarPromocao(){
    const novo: Anuncio = {
      id: Date.now(),
      titulo: this.novaPromocao.titulo.trim(),
      descricao: this.novaPromocao.descricao.trim(),
      valor: Number(this.novaPromocao.valor || 0),
      validade: this.novaPromocao.validade || new Date(),
      imagemUrl: this.novaPromocao.previewUrl || '/assets/imgs/placeholder.png',
      isMeu: true
    };
    this.anuncios = [novo, ...this.anuncios];
    this.fecharModal();
  }
  
  editarAnuncio(a: Anuncio){
    // implemente conforme sua regra (pode reabrir modal preenchido)
    this.abrirModal();
    this.novaPromocao = {
      titulo: a.titulo,
      descricao: a.descricao,
      valor: a.valor,
      validade: (a.validade as Date)?.toISOString?.().slice(0,10) || (a.validade as string),
      imagemArquivo: null,
      previewUrl: a.imagemUrl || null
    };
    // dica: salve o ID atual para atualizar em vez de criar novo
  }
  
  removerAnuncio(a: Anuncio){
    this.anuncios = this.anuncios.filter(x => x.id !== a.id);
  }
}
