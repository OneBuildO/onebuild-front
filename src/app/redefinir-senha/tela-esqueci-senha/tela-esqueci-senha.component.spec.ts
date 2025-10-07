import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaEsqueciSenhaComponent } from './tela-esqueci-senha.component';

describe('TelaEsqueciSenhaComponent', () => {
  let component: TelaEsqueciSenhaComponent;
  let fixture: ComponentFixture<TelaEsqueciSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaEsqueciSenhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaEsqueciSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
