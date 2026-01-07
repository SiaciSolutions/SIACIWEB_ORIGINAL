import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrdenes2Component } from './lista-ordenes2.component';

describe('ListaOrdenes2Component', () => {
  let component: ListaOrdenes2Component;
  let fixture: ComponentFixture<ListaOrdenes2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaOrdenes2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOrdenes2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
