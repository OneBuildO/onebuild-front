import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaRedefinirSenhaComponent } from './tela-redefinir-senha.component';

describe('TelaRedefinirSenhaComponent', () => {
  let component: TelaRedefinirSenhaComponent;
  let fixture: ComponentFixture<TelaRedefinirSenhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaRedefinirSenhaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaRedefinirSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
