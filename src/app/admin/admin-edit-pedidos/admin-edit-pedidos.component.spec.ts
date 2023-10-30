import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPedidosComponent } from './admin-pedidos.component';

describe('AdminEditPedidosComponent', () => {
  let component: AdminEditPedidosComponent;
  let fixture: ComponentFixture<AdminEditPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
