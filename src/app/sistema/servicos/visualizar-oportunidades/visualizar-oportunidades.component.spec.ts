import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarOportunidadesComponent } from './visualizar-oportunidades.component';

describe('VisualizarOportunidadesComponent', () => {
  let component: VisualizarOportunidadesComponent;
  let fixture: ComponentFixture<VisualizarOportunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarOportunidadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarOportunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
