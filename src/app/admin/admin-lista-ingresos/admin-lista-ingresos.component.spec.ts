import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaIngresosComponent } from './admin-pedidos.component';

describe('AdminListaIngresosComponent', () => {
  let component: AdminListaIngresosComponent;
  let fixture: ComponentFixture<AdminListaIngresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaIngresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
