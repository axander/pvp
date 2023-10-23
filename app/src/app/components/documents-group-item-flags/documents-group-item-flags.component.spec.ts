import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGroupItemFlagsComponent } from './documents-group-item-flags.component';

describe('DocumentsGroupItemFlagsComponent', () => {
  let component: DocumentsGroupItemFlagsComponent;
  let fixture: ComponentFixture<DocumentsGroupItemFlagsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsGroupItemFlagsComponent]
    });
    fixture = TestBed.createComponent(DocumentsGroupItemFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
