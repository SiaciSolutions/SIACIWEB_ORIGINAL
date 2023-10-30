import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPedidosMedicosComponent } from './admin-pedidos-medicos.component';

describe('AdminPedidosMedicosComponent', () => {
  let component: AdminPedidosMedicosComponent;
  let fixture: ComponentFixture<AdminPedidosMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPedidosMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPedidosMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
