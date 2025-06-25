import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPromocoesComponent } from './cadastro-promocoes.component';

describe('CadastroPromocoesComponent', () => {
  let component: CadastroPromocoesComponent;
  let fixture: ComponentFixture<CadastroPromocoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadastroPromocoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPromocoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
