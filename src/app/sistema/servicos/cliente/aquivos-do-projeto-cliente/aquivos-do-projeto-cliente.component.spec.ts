import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AquivosDoProjetoClienteComponent } from './aquivos-do-projeto-cliente.component';

describe('AquivosDoProjetoClienteComponent', () => {
  let component: AquivosDoProjetoClienteComponent;
  let fixture: ComponentFixture<AquivosDoProjetoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AquivosDoProjetoClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AquivosDoProjetoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
