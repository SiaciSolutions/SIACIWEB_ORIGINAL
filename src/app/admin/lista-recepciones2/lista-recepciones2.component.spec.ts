import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRecepciones2Component } from './lista-recepciones2.component';

describe('ListaRecepciones2Component', () => {
  let component: ListaRecepciones2Component;
  let fixture: ComponentFixture<ListaRecepciones2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRecepciones2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRecepciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
