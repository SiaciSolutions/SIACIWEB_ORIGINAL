import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminListaCobrosComponent } from './admin-lista-cobros.component';

describe('AdminListaCobrosComponent', () => {
  let component: AdminListaCobrosComponent;
  let fixture: ComponentFixture<AdminListaCobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminListaCobrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminListaCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
