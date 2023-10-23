import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsGroupComponent } from './documents-group.component';

describe('DocumentsGroupComponent', () => {
  let component: DocumentsGroupComponent;
  let fixture: ComponentFixture<DocumentsGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsGroupComponent]
    });
    fixture = TestBed.createComponent(DocumentsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
