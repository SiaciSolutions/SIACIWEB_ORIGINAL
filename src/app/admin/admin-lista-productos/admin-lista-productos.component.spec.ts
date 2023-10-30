import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaProductosComponent } from './admin-pedidos.component';

describe('AdminListaProductosComponent', () => {
  let component: AdminListaProductosComponent;
  let fixture: ComponentFixture<AdminListaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
