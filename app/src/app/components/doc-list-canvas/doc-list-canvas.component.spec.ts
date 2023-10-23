import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocListCanvasComponent } from './doc-list-canvas.component';

describe('DocListCanvasComponent', () => {
  let component: DocListCanvasComponent;
  let fixture: ComponentFixture<DocListCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocListCanvasComponent]
    });
    fixture = TestBed.createComponent(DocListCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
