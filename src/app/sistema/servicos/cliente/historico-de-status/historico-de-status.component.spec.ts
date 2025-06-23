import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoDeStatusComponent } from './historico-de-status.component';

describe('HistoricoDeStatusComponent', () => {
  let component: HistoricoDeStatusComponent;
  let fixture: ComponentFixture<HistoricoDeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoDeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoDeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
