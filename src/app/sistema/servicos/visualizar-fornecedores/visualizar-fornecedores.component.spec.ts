import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarFornecedoresComponent } from './visualizar-fornecedores.component';

describe('VisualizarFornecedoresComponent', () => {
  let component: VisualizarFornecedoresComponent;
  let fixture: ComponentFixture<VisualizarFornecedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarFornecedoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarFornecedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
