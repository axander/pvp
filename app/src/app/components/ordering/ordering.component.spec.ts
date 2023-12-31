import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderingComponent } from './ordering.component';

describe('OrderingComponent', () => {
  let component: OrderingComponent;
  let fixture: ComponentFixture<OrderingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderingComponent]
    });
    fixture = TestBed.createComponent(OrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
