import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarProjetoComponent } from './visualizar-projeto.component';

describe('VisualizarProjetoComponent', () => {
  let component: VisualizarProjetoComponent;
  let fixture: ComponentFixture<VisualizarProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarProjetoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
