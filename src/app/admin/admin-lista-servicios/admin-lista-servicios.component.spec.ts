import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaServiciosComponent } from './admin-pedidos.component';

describe('AdminListaServiciosComponent', () => {
  let component: AdminListaServiciosComponent;
  let fixture: ComponentFixture<AdminListaServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
