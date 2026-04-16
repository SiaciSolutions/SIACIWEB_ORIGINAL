import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaDespachoPedidosComponent } from './admin-lista-despachos-ped.component';

describe('AdminListaDespachoPedidosComponent', () => {
  let component: AdminListaDespachoPedidosComponent;
  let fixture: ComponentFixture<AdminListaDespachoPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaDespachoPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaDespachoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
