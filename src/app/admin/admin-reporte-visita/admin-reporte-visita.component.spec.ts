import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReporteVisitaComponent } from './admin-reporte-visita.component';

describe('AdminReporteVisitaComponent', () => {
  let component: AdminReporteVisitaComponent;
  let fixture: ComponentFixture<AdminReporteVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReporteVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReporteVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
