import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaRecepcionesComponent } from './admin-lista-recepciones.component';

describe('AdminListaRecepcionesComponent', () => {
  let component: AdminListaRecepcionesComponent;
  let fixture: ComponentFixture<AdminListaRecepcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaRecepcionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaRecepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
