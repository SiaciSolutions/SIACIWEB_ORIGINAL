import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboard3Component } from './admin-dashboard3.component';

describe('AdminDashboard3Component', () => {
  let component: AdminDashboard3Component;
  let fixture: ComponentFixture<AdminDashboard3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDashboard3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboard3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
