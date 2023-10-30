import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaPedidosComponent } from './admin-pedidos.component';

describe('AdminListaPedidosComponent', () => {
  let component: AdminListaPedidosComponent;
  let fixture: ComponentFixture<AdminListaPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
