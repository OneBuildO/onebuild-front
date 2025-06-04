import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelFornecedorComponent } from './painel-fornecedor.component';

describe('PainelFornecedorComponent', () => {
  let component: PainelFornecedorComponent;
  let fixture: ComponentFixture<PainelFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelFornecedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
