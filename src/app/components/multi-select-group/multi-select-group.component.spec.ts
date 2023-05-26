import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectGroupComponent } from './multi-select-group.component';

describe('MultiSelectGroupComponent', () => {
  let component: MultiSelectGroupComponent;
  let fixture: ComponentFixture<MultiSelectGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiSelectGroupComponent]
    });
    fixture = TestBed.createComponent(MultiSelectGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
