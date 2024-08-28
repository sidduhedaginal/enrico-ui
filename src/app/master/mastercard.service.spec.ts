import { TestBed } from '@angular/core/testing';

import { MastercardService } from './mastercard.service';

describe('MastercardService', () => {
  let service: MastercardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MastercardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
