import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGroupItemComponent } from './documents-group-item.component';

describe('DocumentsGroupItemComponent', () => {
  let component: DocumentsGroupItemComponent;
  let fixture: ComponentFixture<DocumentsGroupItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsGroupItemComponent]
    });
    fixture = TestBed.createComponent(DocumentsGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
