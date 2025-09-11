import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/services/usuario.service';
import { AlertType } from 'src/app/shared/components/alert/alert.type';
import { CadastroUsuarioDTO } from 'src/app/tela-cadastro/cadastroUsuarioDTO';
import { Permissao } from 'src/app/login/permissao';
import { pageTransition } from 'src/app/shared/utils/animations';
import { AtualizarUsuarioDTO } from './AtualizarUsuarioDTO';
import { CidadesService, listaEstados } from 'src/app/services/services/cidade.service';

@Component({
  selector: 'app-meu-perfil',
  templateUrl: './meu-perfil.component.html',
  styleUrls: ['./meu-perfil.component.css'],
  animations: [pageTransition]
})

export class MeuPerfilComponent implements OnInit {
  isEditing: boolean = false;
  isLoading: boolean = false;
  submited: boolean = false;
  serverErrors: string[] = [];
  tipoAlerta = AlertType.Warning;
  tipoCadastro: Permissao = Permissao.ARQUITETO;

  selectedFile!: File;
  selectedImageUrl: string | ArrayBuffer | null = null;
  defaultImageUrl = './assets/imgs/foto-padrao.png';

  initialFormValues: any;

  private idUsuario : number | null = null;

  public listaCidades: any[] = [];

  cadastroForm = this.formBuilder.group({
    nome: new FormControl({ value: '', disabled: true }, Validators.required ),
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    contato: new FormControl({ value: '', disabled: true }),
    estado: new FormControl({ value: '', disabled: true }, Validators.required),
    cidade: new FormControl({ value: '', disabled: true }, Validators.required),
    cnpj: new FormControl({ value: '', disabled: true }),
    senha: new FormControl({ value: '', disabled: true },),
    confirmPassword: new FormControl({ value: '', disabled: true },)
  });

  constructor(
    private userService: UsuarioService,
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService
  ) {}

  ngOnInit(): void {
    this.userService.getUserLogged().subscribe({
      next: (data: any) => {
        console.log('Dados do usuário:', data); // Adicione um log para verificar os dados retornados
        this.cadastroForm.patchValue({
          nome: data.nome ?? '',
          email: data.email ?? '',
          contato: data.contato ?? '',
          cnpj: data.cnpj ?? '',
          estado: data.estado ?? '',
        });
        this.idUsuario = data.idUsuario ?? null;

        this.obterCidadePorEstado(data.estado ?? '');
        this.cadastroForm.patchValue({
          cidade: data.cidade ?? '',
        });

        this.initialFormValues = this.cadastroForm.getRawValue(); // Guardar valores iniciais
      },
      error: (err) => {
        console.error('Erro ao obter dados do usuário', err);
        // Handle error
      }
    });
  }

  onEdit(): void {
    this.isEditing = true;
    this.cadastroForm.enable(); // Habilitar todos os campos para edição
    this.cadastroForm.controls.senha.setValue(''); // Limpar campo senha
    this.cadastroForm.controls.confirmPassword.setValue(''); // Limpar campo confirmar senha
  }

  onCancel(): void {
    this.isEditing = false;
    this.serverErrors = []; // Limpar mensagens de erro
    this.cadastroForm.patchValue(this.initialFormValues); // Restaurar valores iniciais
    this.cadastroForm.disable(); // Desabilitar os campos
  }

  handleChange(): void {
    this.serverErrors = [];
    this.isSenhaValida();
  }


  onEstadoChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const estadoSigla = selectElement.value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.serviceLocalidade.getCidadesByEstado(estadoSigla).subscribe(data => {
        this.listaCidades = data;
      });
    } else {
      this.listaCidades = [];
    }
  }


  isSenhaValida(): boolean {
    const senha = this.cadastroForm.controls.senha.value;
    const confirmPassword = this.cadastroForm.controls.confirmPassword.value;

    if (senha && senha.length < 8) {
      this.serverErrors.push('Sua senha deve conter pelo menos 8 caracteres');
      this.scrollTop();
      return false;
    }

    if (senha && !confirmPassword) {
      this.serverErrors.push('Preencha o campo confirmar senha.');
      this.scrollTop();
      return false;
    }

    if (confirmPassword && senha !== confirmPassword) {
      this.serverErrors.push('As senhas informadas não coincidem');
      this.scrollTop();
      return false;
    }

    return true;
  }

  onFormSubmitHandler(event: SubmitEvent): void {
    this.tipoAlerta = AlertType.Warning;
    event.preventDefault();
    this.submited = true;
    this.serverErrors = [];
    this.isLoading = true;

    
    if (this.cadastroForm.invalid || !this.isSenhaValida()) {
      this.isLoading = false;
      return;
    }


    const dadosCadastro: AtualizarUsuarioDTO = {
      id: this.idUsuario,
      nome: this.cadastroForm.controls.nome.value,
      email: this.cadastroForm.controls.email.value,
      contato: this.cadastroForm.controls.contato.value,
      cnpj: this.cadastroForm.controls.cnpj.value,
      senha: this.cadastroForm.controls.senha.value,
      permissaoDoUsuario: null,
      tipoFornecedor: null,
      confirmarSenha: this.cadastroForm.controls.confirmPassword.value,
      cidade: this.cadastroForm.controls.cidade.value ?? '',
      estado: this.cadastroForm.controls.estado.value ?? '',
      endereco: ''
    };

    this.userService.updateUser(dadosCadastro).subscribe({
      next: (data: any) => {
        console.log("Usuario Atualizado:", dadosCadastro);
        this.tipoAlerta = AlertType.Success;
        this.serverErrors.push(data);
        this.isEditing = false; // Desabilitar edição após salvar
        this.initialFormValues = this.cadastroForm.getRawValue(); // Atualizar valores iniciais
        this.cadastroForm.disable(); // Desabilitar campos novamente
        this.isLoading = false;
      },
      error: (err) => {
        this.tipoAlerta = AlertType.Danger;
        this.serverErrors.push(err.error);
        this.isLoading = false;
      }
    });
  }

  protected onAlertCloseHandler = (e: any) => {
    this.serverErrors = [];
  };

// Método para lidar com a seleção de arquivos
onImageSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput?.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      // The result can be a string or ArrayBuffer; both are acceptable.
      this.selectedImageUrl = reader.result as string | ArrayBuffer;
    };
    reader.readAsDataURL(file);
  } else {
    this.selectedImageUrl = null; // Handle case where no file is selected
  }
}


  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected readonly ETipoUsuario = Permissao;
  protected readonly listaEstados = listaEstados;
}
