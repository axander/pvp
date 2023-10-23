import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGroupItemFooterComponent } from './documents-group-item-footer.component';

describe('DocumentsGroupItemFooterComponent', () => {
  let component: DocumentsGroupItemFooterComponent;
  let fixture: ComponentFixture<DocumentsGroupItemFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsGroupItemFooterComponent]
    });
    fixture = TestBed.createComponent(DocumentsGroupItemFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
