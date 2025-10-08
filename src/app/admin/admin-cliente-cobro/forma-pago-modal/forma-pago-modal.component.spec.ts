import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaPagoModalComponent } from './forma-pago-modal.component';

describe('FormaPagoModalComponent', () => {
  let component: FormaPagoModalComponent;
  let fixture: ComponentFixture<FormaPagoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaPagoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaPagoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
