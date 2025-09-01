import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/services/auth.service';
import { Permissao } from 'src/app/login/permissao';
import { PermissaoDescricoes } from 'src/app/login/permissao-descricao';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;

  isSidebarOpen = false;
  isDropdownOpen = false;

  projetoId: number | null = null;

  nomeUsuario: string = '';
  permissaoUsuario: string = '';
  estadoUsuario: string = '';
  cidadeUsuario: string = '';
  enderecoUsuario: string = '';
  cargoUsuario!: Permissao;
  fotoUsuario: string | null = null;
  dashboardLink: string = '';

  // Variáveis para controle das notificações
  isNotificationOpen = false;
  notifications: any[] = [];
  unreadNotifications = 0;

  // Dados de exemplo (substitua pelos dados reais da sua aplicação)
  mockNotifications = [
    {
      id: 1,
      message: 'Seu projeto CASA DA PRAIA do cliente GUILHERME SALES foi atualizado',
      time: 'Há 10 minutos',
      read: false,
      type: 'project',
      icon: 'assets/icones/icone-caderno.svg'
    },
    {
      id: 2,
      message: 'Seu projeto CASA DA PRAIA teve suas informações atualizadas.',
      time: 'Há 1 hora',
      read: false,
      type: 'activity',
      icon: 'assets/icones/ati.svg'
    },
    {
      id: 3,
      message: 'Reunião agendada para o dia 14/09/2025',
      time: 'Há 2 horas',
      read: true,
      type: 'meeting',
      icon: 'assets/icones/cale.svg'
    }
  ];


  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}


  ngOnInit(): void {
    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.nomeUsuario = usuario.nome;
        const tipoUsuarioRole = 'ROLE_' + usuario.tipoUsuario; // ✅ ajustado
        this.cargoUsuario = tipoUsuarioRole as Permissao;
        this.permissaoUsuario = PermissaoDescricoes[this.cargoUsuario] || 'Permissão desconhecida';
        this.fotoUsuario = usuario.fotoUsuario || null;
        this.estadoUsuario = usuario.estado;
        this.cidadeUsuario = usuario.cidade;
        this.enderecoUsuario = usuario.endereco;

        //console.log('Tipo de usuário recebido:', tipoUsuarioRole);

        switch (tipoUsuarioRole) {
          case 'ROLE_ADMIN':
            this.dashboardLink = '/usuario/dashboard-admin';
            break;
          case 'ROLE_CLIENTE':
            this.dashboardLink = '/usuario/dashboard-cliente';
            break;
          case 'ROLE_FORNECEDOR':
            this.dashboardLink = '/usuario/dashboard-fornecedor';
            break;
          case 'ROLE_ARQUITETO':
            this.dashboardLink = '/usuario/dashboard-arquiteto';
            break;
          case 'ROLE_CONSTRUTORA':
            this.dashboardLink = '/usuario/dashboard-contrutora';
            break;
          case 'ROLE_DESIGN_INTERIORES':
            this.dashboardLink = '/usuario/dashboard-design-de-interior';
            break;
          default:
            this.dashboardLink = '/forbidden';
            break;
        }
      },
      (err) => {
        console.error('Erro ao buscar perfil do usuário', err);
      }
    );
    // Carrega notificações (aqui usando dados mockados)
    this.notifications = this.mockNotifications;
    this.updateUnreadCount();
  }

  // Método para alternar o dropdown de notificações
  toggleNotification(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
    
    // Fecha o dropdown do usuário se estiver aberto
    if (this.isNotificationOpen && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
    
    // Marca notificações como lidas quando o dropdown é aberto
    if (this.isNotificationOpen) {
      this.markNotificationsAsRead();
    }
  }

  // Método para marcar notificações como lidas
  markNotificationsAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    // Marca todas as notificações como lidas
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    
    // Atualiza o contador de notificações não lidas
    this.updateUnreadCount();
    
    // Aqui você também pode adicionar uma chamada API se necessário
    // this.notificationService.markAllAsRead().subscribe(...);
  }

  // Método para atualizar contador de não lidas
  updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.read).length;
  }


  ngAfterViewInit(): void {
    if (!this.sidebar || !this.header || !this.content) {
      console.error('Erro: Elementos da Navbar não foram encontrados');
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (this.sidebar && this.header && this.content) {
      if (this.isSidebarOpen) {
        this.renderer.addClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.addClass(this.header.nativeElement, 'left-pd');
        this.renderer.addClass(this.content.nativeElement, 'shifted');
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', '280px');
      } else {
        this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.removeClass(this.header.nativeElement, 'left-pd');
        this.renderer.removeClass(this.content.nativeElement, 'shifted');
        this.renderer.setStyle(this.content.nativeElement, 'margin-left', '90px');
      }
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;

    if (this.sidebar && this.header && this.content) {
      this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
      this.renderer.removeClass(this.header.nativeElement, 'left-pd');
      this.renderer.removeClass(this.content.nativeElement, 'shifted');
    }
  }

  getInitial(name: string): string {
  return name ? name.charAt(0).toUpperCase() : '?';
}

getRandomColor(seed: string): string {
  const colors = [
    '#FFB3BA', // rosa pastel
    '#FFDFBA', // laranja pastel
    '#BAFFC9', // verde pastel
    '#BAE1FF', // azul pastel
    '#D5BAFF'  // roxo pastel
  ];
  const index = seed ? seed.charCodeAt(0) % colors.length : 0;
  return colors[index];
}


  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
      if (this.isDropdownOpen) {
        dropdownToggle.classList.add('active');
      } else {
        dropdownToggle.classList.remove('active');
      }
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    this.authService.encerrarSessao();
    this.router.navigate(['/login']);
  }
}
