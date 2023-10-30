import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaOrdenesComponent } from './admin-pedidos.component';

describe('AdminListaOrdenesComponent', () => {
  let component: AdminListaOrdenesComponent;
  let fixture: ComponentFixture<AdminListaOrdenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaOrdenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
