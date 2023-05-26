import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTemplateItemComponent } from './new-template-item.component';

describe('NewTemplateItemComponent', () => {
  let component: NewTemplateItemComponent;
  let fixture: ComponentFixture<NewTemplateItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewTemplateItemComponent]
    });
    fixture = TestBed.createComponent(NewTemplateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
