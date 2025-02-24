import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaTranferenciasComponent } from './admin-pedidos.component';

describe('AdminListaTranferenciasComponent', () => {
  let component: AdminListaTranferenciasComponent;
  let fixture: ComponentFixture<AdminListaTranferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaTranferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaTranferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
