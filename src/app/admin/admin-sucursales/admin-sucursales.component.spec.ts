import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSucursalesComponent } from './admin-pedidos.component';

describe('AdminSucursalesComponent', () => {
  let component: AdminSucursalesComponent;
  let fixture: ComponentFixture<AdminSucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
