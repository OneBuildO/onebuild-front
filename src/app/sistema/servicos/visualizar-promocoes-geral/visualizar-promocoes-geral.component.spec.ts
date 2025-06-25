import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPromocoesGeralComponent } from './visualizar-promocoes-geral.component';

describe('VisualizarPromocoesGeralComponent', () => {
  let component: VisualizarPromocoesGeralComponent;
  let fixture: ComponentFixture<VisualizarPromocoesGeralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarPromocoesGeralComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPromocoesGeralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
