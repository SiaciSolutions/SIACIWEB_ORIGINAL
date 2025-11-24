import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotaCreditoComponent } from './admin-nota-credito.component';

describe('AdminNotaCreditoComponent', () => {
  let component: AdminNotaCreditoComponent;
  let fixture: ComponentFixture<AdminNotaCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNotaCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNotaCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
