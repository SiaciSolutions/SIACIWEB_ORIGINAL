import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPosCajaRegistradoraComponent } from './admin-pedidos.component';

describe('AdminPosCajaRegistradoraComponent', () => {
  let component: AdminPosCajaRegistradoraComponent;
  let fixture: ComponentFixture<AdminPosCajaRegistradoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPosCajaRegistradoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPosCajaRegistradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
