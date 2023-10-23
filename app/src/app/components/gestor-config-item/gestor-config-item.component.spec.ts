import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorConfigItemComponent } from './gestor-config-item.component';

describe('GestorConfigItemComponent', () => {
  let component: GestorConfigItemComponent;
  let fixture: ComponentFixture<GestorConfigItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestorConfigItemComponent]
    });
    fixture = TestBed.createComponent(GestorConfigItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
