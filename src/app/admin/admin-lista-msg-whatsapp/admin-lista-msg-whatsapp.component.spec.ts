import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaEgresosComponent } from './admin-pedidos.component';

describe('AdminListaEgresosComponent', () => {
  let component: AdminListaEgresosComponent;
  let fixture: ComponentFixture<AdminListaEgresosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaEgresosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
