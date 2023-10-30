import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServiciosComponent } from './admin-ingreso-articulos.component';

describe('AdminServiciosComponent', () => {
  let component: AdminServiciosComponent;
  let fixture: ComponentFixture<AdminServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
