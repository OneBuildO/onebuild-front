import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelProfissionaisComponent } from './painel-profissionais.component';

describe('PainelProfissionaisComponent', () => {
  let component: PainelProfissionaisComponent;
  let fixture: ComponentFixture<PainelProfissionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelProfissionaisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelProfissionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
