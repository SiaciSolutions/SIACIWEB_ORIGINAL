import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaPedidosLogComponent } from './admin-lista-pedidos-log.component';

describe('AdminListaPedidosLogComponent', () => {
  let component: AdminListaPedidosLogComponent;
  let fixture: ComponentFixture<AdminListaPedidosLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaPedidosLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaPedidosLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
