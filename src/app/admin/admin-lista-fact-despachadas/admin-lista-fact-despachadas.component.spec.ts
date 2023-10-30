import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaFacDespachadasComponent } from './admin-pedidos.component';

describe('AdminListaFacDespachadasComponent', () => {
  let component: AdminListaFacDespachadasComponent;
  let fixture: ComponentFixture<AdminListaFacDespachadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaFacDespachadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaFacDespachadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
