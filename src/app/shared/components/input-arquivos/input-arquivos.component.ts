import { Component, OnInit, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-arquivos',
  templateUrl: './input-arquivos.component.html',
  styleUrls: ['./input-arquivos.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputArquivosComponent),
      multi: true,
    },
  ],
})
export class InputArquivosComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = 'Clique ou arraste o arquivo para fazer upload';
  @Input() isEditMode = false;
  @Output() arquivosSelecionados = new EventEmitter<File[]>();

  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Apenas arquivos novos serão manipulados aqui
  arquivos: File[] = [];

  // ControlValueAccessor callbacks
  onChange: (value: File[]) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    console.log('InputArquivosComponent inicializado');
  }

  writeValue(files: File[]): void {
    console.log('Arquivos recebidos no writeValue:', files);
    this.arquivos = files || [];
    console.log('Arquivos armazenados no componente:', this.arquivos);
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.adicionarArquivos(Array.from(input.files));
    }
  }

  removeArquivo(idx: number): void {
    this.arquivos.splice(idx, 1);
    this.onChange([...this.arquivos]);
    this.arquivosSelecionados.emit([...this.arquivos]);
    if (this.arquivos.length < 3) {
      this.errorMessage = null;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files.length) {
      this.adicionarArquivos(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  adicionarArquivos(novosArquivos: File[]): void {
    this.isEditMode = false;

    // Verifica se o número total de arquivos não excede o limite de 3
    if (this.arquivos.length + novosArquivos.length > 3) {
      this.errorMessage = 'Você pode enviar no máximo 3 arquivos.';
      return;
    }

    for (let arquivo of novosArquivos) {
      // Verifica se o arquivo é do tipo permitido
      if (!this.isValidFileType(arquivo)) {
        this.errorMessage = 'Arquivo inválido. Aceitamos apenas PDFs, imagens (JPEG/PNG) e documentos Word.';
        return;
      }

      // Verifica se o arquivo já não foi adicionado
      if (!this.isDuplicate(arquivo)) {
        this.arquivos.push(arquivo);
      }
    }

    this.onChange([...this.arquivos]);
    this.arquivosSelecionados.emit([...this.arquivos]);
    this.errorMessage = null;
  }

  private isValidFileType(file: File): boolean {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(file.type);
  }

  private isDuplicate(file: File): boolean {
    return this.arquivos.some(a => a.name === file.name && a.size === file.size);
  }
}