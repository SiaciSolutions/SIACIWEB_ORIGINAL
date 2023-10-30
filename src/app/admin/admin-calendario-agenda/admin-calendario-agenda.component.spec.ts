import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCalendarioAgendaComponent } from './admin-calendario-agenda.component';

describe('AdminCalendarioAgendaComponent', () => {
  let component: AdminCalendarioAgendaComponent;
  let fixture: ComponentFixture<AdminCalendarioAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCalendarioAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCalendarioAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
