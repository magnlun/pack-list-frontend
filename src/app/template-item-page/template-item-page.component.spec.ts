import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateItemPageComponent } from './template-item-page.component';

describe('TemplateItemPageComponent', () => {
  let component: TemplateItemPageComponent;
  let fixture: ComponentFixture<TemplateItemPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TemplateItemPageComponent]
    });
    fixture = TestBed.createComponent(TemplateItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
