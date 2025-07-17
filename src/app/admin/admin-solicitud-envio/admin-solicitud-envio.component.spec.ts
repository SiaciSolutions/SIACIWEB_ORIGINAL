import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSolicitudEnvioComponent } from './admin-solicitud-envio.component';

describe('AdminSolicitudEnvioComponent', () => {
  let component: AdminSolicitudEnvioComponent;
  let fixture: ComponentFixture<AdminSolicitudEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSolicitudEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSolicitudEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
