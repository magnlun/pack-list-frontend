import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTemplateItemComponent } from './edit-template-item.component';

describe('EditTemplateItemComponent', () => {
  let component: EditTemplateItemComponent;
  let fixture: ComponentFixture<EditTemplateItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditTemplateItemComponent]
    });
    fixture = TestBed.createComponent(EditTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
