import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdenRecepcionComponent } from './admin-orden-recepcion.component';

describe('AdminOrdenRecepcionComponent', () => {
  let component: AdminOrdenRecepcionComponent;
  let fixture: ComponentFixture<AdminOrdenRecepcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrdenRecepcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdenRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
