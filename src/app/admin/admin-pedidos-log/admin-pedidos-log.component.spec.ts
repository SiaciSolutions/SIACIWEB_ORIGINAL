import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosLogComponent } from './admin-pedidos-log.component';

describe('AdminPedidosLogComponent', () => {
  let component: AdminPedidosLogComponent;
  let fixture: ComponentFixture<AdminPedidosLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPedidosLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPedidosLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
