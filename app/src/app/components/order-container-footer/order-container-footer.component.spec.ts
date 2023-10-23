import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderContainerFooterComponent } from './order-container-footer.component';

describe('OrderContainerFooterComponent', () => {
  let component: OrderContainerFooterComponent;
  let fixture: ComponentFixture<OrderContainerFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderContainerFooterComponent]
    });
    fixture = TestBed.createComponent(OrderContainerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
