import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConteoArticulosComponent } from './admin-ingreso-articulos.component';

describe('AdminConteoArticulosComponent', () => {
  let component: AdminConteoArticulosComponent;
  let fixture: ComponentFixture<AdminConteoArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConteoArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConteoArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
