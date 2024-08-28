import { TestBed } from '@angular/core/testing';

import { CommonApiServiceService } from './common-api-service.service';

describe('CommonApiServiceService', () => {
  let service: CommonApiServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonApiServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
