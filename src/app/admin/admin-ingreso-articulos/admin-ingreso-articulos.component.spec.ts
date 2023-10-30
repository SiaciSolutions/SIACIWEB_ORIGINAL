import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminIngresoArticulosComponent } from './admin-ingreso-articulos.component';

describe('AdminIngresoArticulosComponent', () => {
  let component: AdminIngresoArticulosComponent;
  let fixture: ComponentFixture<AdminIngresoArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminIngresoArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminIngresoArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
