import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelaEnvioDoCodigoComponent } from './tela-envio-do-codigo.component';

describe('TelaEnvioDoCodigoComponent', () => {
  let component: TelaEnvioDoCodigoComponent;
  let fixture: ComponentFixture<TelaEnvioDoCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelaEnvioDoCodigoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelaEnvioDoCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
