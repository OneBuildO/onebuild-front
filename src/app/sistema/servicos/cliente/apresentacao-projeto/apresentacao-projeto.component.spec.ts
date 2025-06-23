import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApresentacaoProjetoComponent } from './apresentacao-projeto.component';

describe('ApresentacaoProjetoComponent', () => {
  let component: ApresentacaoProjetoComponent;
  let fixture: ComponentFixture<ApresentacaoProjetoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApresentacaoProjetoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApresentacaoProjetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
