import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaDeProcessosComponent } from './agenda-de-processos.component';

describe('AgendaDeProcessosComponent', () => {
  let component: AgendaDeProcessosComponent;
  let fixture: ComponentFixture<AgendaDeProcessosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaDeProcessosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaDeProcessosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
