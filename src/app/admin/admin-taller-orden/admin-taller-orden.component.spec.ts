import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdenTallerComponent } from './admin-pedidos.component';

describe('AdminOrdenTallerComponent', () => {
  let component: AdminOrdenTallerComponent;
  let fixture: ComponentFixture<AdminOrdenTallerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrdenTallerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdenTallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
