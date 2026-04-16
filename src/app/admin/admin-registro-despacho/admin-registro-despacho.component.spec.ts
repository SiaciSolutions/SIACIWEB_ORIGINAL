import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistroDespachoPedidosComponent } from './admin-registro-despacho.component';

describe('AdminRegistroDespachoPedidosComponent', () => {
  let component: AdminRegistroDespachoPedidosComponent;
  let fixture: ComponentFixture<AdminRegistroDespachoPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRegistroDespachoPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegistroDespachoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
