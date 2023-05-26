import { TestBed } from '@angular/core/testing';

import { PackListService } from '../pack-list.service';

describe('PackListService', () => {
  let service: PackListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
