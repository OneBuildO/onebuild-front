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

  nomeUsuario: string = '';
  permissaoUsuario: string = '';
  cargoUsuario!: Permissao;
  fotoUsuario: string | null = null;
  dashboardLink: string = '';

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
      this.fotoUsuario = usuario.fotoUsuario?.documentoUrl || null;

      console.log('Tipo de usuário recebido:', tipoUsuarioRole);

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
