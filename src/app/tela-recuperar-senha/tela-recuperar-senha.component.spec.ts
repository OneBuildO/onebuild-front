import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaRecuperarSenhaComponent } from './tela-recuperar-senha.component';

describe('TelaRecuperarSenhaComponent', () => {
  let component: TelaRecuperarSenhaComponent;
  let fixture: ComponentFixture<TelaRecuperarSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaRecuperarSenhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaRecuperarSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
