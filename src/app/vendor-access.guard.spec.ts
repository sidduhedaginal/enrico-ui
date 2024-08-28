import { TestBed } from '@angular/core/testing';

import { VendorAccessGuard } from './vendor-access.guard';

describe('VendorAccessGuard', () => {
  let guard: VendorAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VendorAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
