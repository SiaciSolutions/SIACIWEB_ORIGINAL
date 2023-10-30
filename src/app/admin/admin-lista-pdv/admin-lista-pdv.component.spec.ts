import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaPdvComponent } from './admin-pedidos.component';

describe('AdminListaPdvComponent', () => {
  let component: AdminListaPdvComponent;
  let fixture: ComponentFixture<AdminListaPdvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaPdvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaPdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
