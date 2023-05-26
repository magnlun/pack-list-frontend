import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackListListPageComponent } from './pack-list-list-page.component';

describe('PackListListPageComponent', () => {
  let component: PackListListPageComponent;
  let fixture: ComponentFixture<PackListListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackListListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackListListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
