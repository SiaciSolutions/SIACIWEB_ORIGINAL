import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEgresoArticulosComponent } from './admin-ingreso-articulos.component';

describe('AdminEgresoArticulosComponent', () => {
  let component: AdminEgresoArticulosComponent;
  let fixture: ComponentFixture<AdminEgresoArticulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEgresoArticulosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEgresoArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
