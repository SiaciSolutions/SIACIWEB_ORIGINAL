import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaNotasCreditoComponent } from './admin-lista-notas-credito.component';

describe('AdminListaNotasCreditoComponent', () => {
  let component: AdminListaNotasCreditoComponent;
  let fixture: ComponentFixture<AdminListaNotasCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaNotasCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaNotasCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
