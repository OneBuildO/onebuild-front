import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPromocoesComponent } from './visualizar-promocoes.component';

describe('VisualizarPromocoesComponent', () => {
  let component: VisualizarPromocoesComponent;
  let fixture: ComponentFixture<VisualizarPromocoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarPromocoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPromocoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
