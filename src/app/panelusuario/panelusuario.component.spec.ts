import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelusuarioComponent } from './panelusuario.component';

describe('PanelusuarioComponent', () => {
  let component: PanelusuarioComponent;
  let fixture: ComponentFixture<PanelusuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelusuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
