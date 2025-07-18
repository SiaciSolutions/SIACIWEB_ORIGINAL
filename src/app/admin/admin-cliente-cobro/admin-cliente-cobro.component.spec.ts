import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClienteCobroComponent } from './admin-cliente-cobro.component';

describe('AdminClienteCobroComponent', () => {
  let component: AdminClienteCobroComponent;
  let fixture: ComponentFixture<AdminClienteCobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClienteCobroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClienteCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
