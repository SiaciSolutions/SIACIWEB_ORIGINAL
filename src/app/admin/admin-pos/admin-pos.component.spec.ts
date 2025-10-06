import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPosComponent } from './admin-pos.component';

describe('AdminPosComponent', () => {
  let component: AdminPosComponent;
  let fixture: ComponentFixture<AdminPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
