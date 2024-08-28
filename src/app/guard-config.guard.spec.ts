import { TestBed } from '@angular/core/testing';

import { GuardConfigGuard } from './guard-config.guard';

describe('GuardConfigGuard', () => {
  let guard: GuardConfigGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardConfigGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
