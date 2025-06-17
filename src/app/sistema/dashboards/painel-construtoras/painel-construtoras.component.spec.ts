import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelConstrutorasComponent } from './painel-construtoras.component';

describe('PainelConstrutorasComponent', () => {
  let component: PainelConstrutorasComponent;
  let fixture: ComponentFixture<PainelConstrutorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelConstrutorasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelConstrutorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
