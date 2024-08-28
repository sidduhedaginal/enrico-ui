import { TestBed } from '@angular/core/testing';

import { ImportedNTIDService } from './imported-ntid.service';

describe('ImportedNTIDService', () => {
  let service: ImportedNTIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportedNTIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
