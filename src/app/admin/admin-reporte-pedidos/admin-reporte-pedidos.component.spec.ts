import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReportePedidosComponent } from './admin-pedidos.component';

describe('AdminReportePedidosComponent', () => {
  let component: AdminReportePedidosComponent;
  let fixture: ComponentFixture<AdminReportePedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReportePedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReportePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
