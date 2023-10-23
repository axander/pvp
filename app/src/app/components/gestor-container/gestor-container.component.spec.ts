import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorContainerComponent } from './gestor-container.component';

describe('GestorContainerComponent', () => {
  let component: GestorContainerComponent;
  let fixture: ComponentFixture<GestorContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestorContainerComponent]
    });
    fixture = TestBed.createComponent(GestorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
