import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePackListComponent } from './create-pack-list.component';

describe('CreatePackListComponent', () => {
  let component: CreatePackListComponent;
  let fixture: ComponentFixture<CreatePackListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePackListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
