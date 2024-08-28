import { TestBed } from '@angular/core/testing';

import { ImportdataService } from './importdata.service';

describe('ImportdataService', () => {
  let service: ImportdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
