import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeableComponent } from './swipeable.component';

describe('SwipeableComponent', () => {
  let component: SwipeableComponent;
  let fixture: ComponentFixture<SwipeableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SwipeableComponent]
    });
    fixture = TestBed.createComponent(SwipeableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
