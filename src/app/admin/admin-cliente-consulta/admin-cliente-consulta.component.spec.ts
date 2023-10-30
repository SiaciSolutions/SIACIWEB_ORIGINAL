import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClienteConsultaComponent } from './admin-cliente.component';

describe('AdminClienteConsultaComponent', () => {
  let component: AdminClienteConsultaComponent;
  let fixture: ComponentFixture<AdminClienteConsultaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminClienteConsultaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClienteConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
