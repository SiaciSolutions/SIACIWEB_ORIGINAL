import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaNoExisteComponent } from './ruta-no-existe.component';

describe('RutaNoExisteComponent', () => {
  let component: RutaNoExisteComponent;
  let fixture: ComponentFixture<RutaNoExisteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RutaNoExisteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaNoExisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
