import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelArquitetoComponent } from './painel-arquiteto.component';

describe('PainelArquitetoComponent', () => {
  let component: PainelArquitetoComponent;
  let fixture: ComponentFixture<PainelArquitetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelArquitetoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelArquitetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
