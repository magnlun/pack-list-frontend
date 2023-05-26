import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSummaryComponent } from './list-summary.component';

describe('ListSummaryComponent', () => {
  let component: ListSummaryComponent;
  let fixture: ComponentFixture<ListSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSummaryComponent]
    });
    fixture = TestBed.createComponent(ListSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
