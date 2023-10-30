import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterPedidosComponent } from './starter-pedidos.component';

describe('StarterPedidosComponent', () => {
  let component: StarterPedidosComponent;
  let fixture: ComponentFixture<StarterPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarterPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarterPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
