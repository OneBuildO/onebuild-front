import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { ModalDeleteService } from 'src/app/services/services/modal-delete.service';
import { ProjetoService } from 'src/app/services/services/projeto.service';

@Component({
  selector: 'app-visualizar-projeto',
  templateUrl: './visualizar-projeto.component.html',
  styleUrls: ['./visualizar-projeto.component.css']
})
export class VisualizarProjetoComponent implements OnInit {

  termoBusca: string = '';
    mensagemBusca: string = '';
    isLoading = false;
    successMessage: string = '';
    messageTimeout: any;
  

    itensPorPagina = 6;
    paginaAtual = 1;
    
    projetosPaginados: any[] = []; // ou tipo correto se souber
    totalItens: number = 0;
  
    selectedProjeto: any = null;
  
   
    constructor(
      private router: Router,
     private modalDeleteService: ModalDeleteService,
      private authService: AuthService,
      private projetoService: ProjetoService
    ) {}
  
    ngOnInit(): void {
      this.exibirMensagemDeSucesso();
      this.fetchLojas();
      this.atualizarPaginacao();
    }
  
    cadastrarProjeto(): void {
      this.router.navigate(['/usuario/cadastro-projeto']);
    }
  
    onSearch(searchTerm: string) {
    
    }
  
    atualizarPaginacao(): void {
     
    }
  
  
    onPaginaMudou(novaPagina: number) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
    }
  
    fetchLojas(): void {
   
    }
  
    visualizarLoja(id: string): void {
      this.router.navigate(['/usuario/detalhes-loja', id]);
    }
  
    editarLoja(id: string): void {
      this.router.navigate(['/usuario/cadastro-de-lojas', id]);
    }
  
    deleteLoja(id: string): void {
   
    }
  
    getInitial(name?: string): string {
      return name && name.length > 0 ? name.charAt(0).toUpperCase() : '';
    }
  
    getRandomColor(seed?: string): string {
      const colors = [
        '#FFB3BA', // Rosa pastel
        '#FFDFBA', // Laranja pastel
        '#BAFFC9', // Verde pastel
        '#BAE1FF', // Azul pastel
        '#D5BAFF', // Roxo pastel
      ];
      const index =
        seed && seed.length > 0 ? seed.charCodeAt(0) % colors.length : 0;
      return colors[index];
    }
  
    openModalDeletar(projeto: any): void {
      this.selectedProjeto = projeto;
      this.modalDeleteService.openModal(
      {
        title: 'Remoção de Projeto',
        description: `Tem certeza que deseja excluir o projeto <strong>${
          projeto.nome
        } - ${projeto.estado || '-'} - ${projeto.cidade}</strong>?`,
        item: projeto,
        deletarTextoBotao: 'Remover',
        size: 'md',
      },
      () => {
        // this.deleteProjeto(projeto.id);
      }
    );
  
    }

  visualizarProjeto(id: string): void {
    this.router.navigate(['/usuario/detalhes-projeto', id]);
  }

  editarProjeto(id: string): void {
    this.router.navigate(['/usuario/cadastro-projeto', id]);
  }

      //PRA QUANDO O ENDPOINT TIVER IMPLEMENTADO
  //   fetchClientes(): void {
  //   this.projetoService.obterTodosProjetos().subscribe({
  //     next: (res) => {
  //       if (res && res.statusCode === 200) {
  //         this.projetosPaginados = res.response ?? [];
  //         console.log(res.response);
  //         this.erro = null;
  //       } else {
  //         this.erro = 'Erro ao buscar clientes.';
  //         this.projetosPaginados = [];
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Erro na API:', err);
  //       this.erro = 'Erro ao conectar com o servidor.';
  //       this.projetosPaginados = [];
  //     }
  //   });
  // }


  // deleteProjeto(id:string){
  //   const projetoRemovido = this.projetosPaginados.find((e) => e.id === id);

  //   this.projetoService.deleteProjetoById(id).subscribe(
  //     () => {
  //       console.log('Cliente deletado com sucesso!');
  //       this.fetchProjetos();
  //       this.showMessage(
  //         'success',
  //         `Cliente "${projetoRemovido?.nome || ''} - 
  //         ${ projetoRemovido?.estado || '-'}" - ${projetoRemovido?.cidade } deletado com sucesso!`
  //       );
  //     },
  //     (error) => {
  //       console.error('Erro ao deletar o cliente:', error);
  //     }
  //   );
  // }
  
    exibirMensagemDeSucesso(): void {
      const state = window.history.state as { successMessage?: string };
      if (state?.successMessage) {
        this.successMessage = state.successMessage;
        setTimeout(() => (this.successMessage = ''), 3000);
        window.history.replaceState({}, document.title);
      }
    }
  
    showMessage(type: 'success' | 'error', msg: string) {
      this.clearMessage();
      if (type === 'success') this.successMessage = msg;
      this.messageTimeout = setTimeout(() => this.clearMessage(), 3000);
    }
  
    clearMessage() {
      this.successMessage = '';
      if (this.messageTimeout) clearTimeout(this.messageTimeout);
    }
  
    onVoltarClick() {
      const rota = this.authService.getHomeRouteForRole();
      this.router.navigate([rota]);
    }
    

}
