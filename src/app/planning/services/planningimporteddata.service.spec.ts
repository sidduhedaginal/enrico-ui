import { TestBed } from '@angular/core/testing';

import { PlanningImportedData } from './planningimporteddata.service';

describe('PlanningImportedData', () => {
  let service: PlanningImportedData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningImportedData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
