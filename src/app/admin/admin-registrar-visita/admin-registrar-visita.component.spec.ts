import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegistrarVisitaComponent } from './admin-cliente.component';

describe('AdminRegistrarVisitaComponent', () => {
  let component: AdminRegistrarVisitaComponent;
  let fixture: ComponentFixture<AdminRegistrarVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRegistrarVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRegistrarVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
