import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ordenes2Component } from './ordenes2.component';

describe('Ordenes2Component', () => {
  let component: Ordenes2Component;
  let fixture: ComponentFixture<Ordenes2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ordenes2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ordenes2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
