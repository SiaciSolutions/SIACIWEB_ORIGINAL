import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewPedidosComponent } from './admin-pedidos.component';

describe('AdminViewPedidosComponent', () => {
  let component: AdminViewPedidosComponent;
  let fixture: ComponentFixture<AdminViewPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
