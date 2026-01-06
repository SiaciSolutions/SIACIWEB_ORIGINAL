import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Recepciones2Component } from './recepciones2.component';

describe('Recepciones2Component', () => {
  let component: Recepciones2Component;
  let fixture: ComponentFixture<Recepciones2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Recepciones2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Recepciones2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
