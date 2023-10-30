import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaPedidosMedicosComponent } from './admin-pedidos.component';

describe('AdminListaPedidosMedicosComponent', () => {
  let component: AdminListaPedidosMedicosComponent;
  let fixture: ComponentFixture<AdminListaPedidosMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaPedidosMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaPedidosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
