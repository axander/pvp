import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentGroupErrorComponent } from './document-group-error.component';

describe('DocumentGroupErrorComponent', () => {
  let component: DocumentGroupErrorComponent;
  let fixture: ComponentFixture<DocumentGroupErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentGroupErrorComponent]
    });
    fixture = TestBed.createComponent(DocumentGroupErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
