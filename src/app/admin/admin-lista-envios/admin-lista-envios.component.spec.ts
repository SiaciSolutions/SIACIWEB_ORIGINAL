import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaEnviosComponent } from './admin-lista-envios.component';

describe('AdminListaEnviosComponent', () => {
  let component: AdminListaEnviosComponent;
  let fixture: ComponentFixture<AdminListaEnviosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaEnviosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaEnviosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
