import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTransfBodegaComponent } from './admin-ingreso-articulos.component';

describe('AdminTransfBodegaComponent', () => {
  let component: AdminTransfBodegaComponent;
  let fixture: ComponentFixture<AdminTransfBodegaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTransfBodegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTransfBodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
