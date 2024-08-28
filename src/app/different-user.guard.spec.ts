import { TestBed } from '@angular/core/testing';

import { DifferentUserGuard } from './different-user.guard';

describe('DifferentUserGuard', () => {
  let guard: DifferentUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DifferentUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
