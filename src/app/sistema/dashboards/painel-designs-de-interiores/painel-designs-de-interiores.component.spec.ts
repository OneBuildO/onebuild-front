import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelDesignsDeInterioresComponent } from './painel-designs-de-interiores.component';

describe('PainelDesignsDeInterioresComponent', () => {
  let component: PainelDesignsDeInterioresComponent;
  let fixture: ComponentFixture<PainelDesignsDeInterioresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PainelDesignsDeInterioresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PainelDesignsDeInterioresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
