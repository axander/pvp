import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestorConfigItemSelectorComponent } from './gestor-config-item-selector.component';

describe('GestorConfigItemSelectorComponent', () => {
  let component: GestorConfigItemSelectorComponent;
  let fixture: ComponentFixture<GestorConfigItemSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestorConfigItemSelectorComponent]
    });
    fixture = TestBed.createComponent(GestorConfigItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
