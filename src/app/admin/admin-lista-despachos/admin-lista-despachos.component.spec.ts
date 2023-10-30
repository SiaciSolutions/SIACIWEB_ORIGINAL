import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaDespachosComponent } from './admin-pedidos.component';

describe('AdminListaDespachosComponent', () => {
  let component: AdminListaDespachosComponent;
  let fixture: ComponentFixture<AdminListaDespachosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaDespachosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaDespachosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
