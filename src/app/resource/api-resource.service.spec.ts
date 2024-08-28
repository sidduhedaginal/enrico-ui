import { TestBed } from '@angular/core/testing';

import { ApiResourceService } from './api-resource.service';

describe('ApiResourceService', () => {
  let service: ApiResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
