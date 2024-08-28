import { TestBed } from '@angular/core/testing';

import { EnricoBoschUsersGuard } from './enrico-bosch-users.guard';

describe('EnricoBoschUsersGuard', () => {
  let guard: EnricoBoschUsersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EnricoBoschUsersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
