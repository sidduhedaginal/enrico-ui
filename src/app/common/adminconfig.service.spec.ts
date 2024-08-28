import { TestBed } from '@angular/core/testing';

import { AdminconfigService } from './adminconfig.service';

describe('AdminconfigService', () => {
  let service: AdminconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
