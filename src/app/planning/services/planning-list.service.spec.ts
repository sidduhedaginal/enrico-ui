import { TestBed } from '@angular/core/testing';

import { PlanningListService } from './planning-list.service';

describe('PlanningListService', () => {
  let service: PlanningListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
