import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesProgressoProjetoComponent } from './detalhes-progresso-projeto.component';

describe('DetalhesProgressoProjetoComponent', () => {
  let component: DetalhesProgressoProjetoComponent;
  let fixture: ComponentFixture<DetalhesProgressoProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhesProgressoProjetoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesProgressoProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
