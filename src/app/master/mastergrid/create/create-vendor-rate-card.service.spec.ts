import { TestBed } from '@angular/core/testing';

import { CreateVendorRateCardService } from './create-vendor-rate-card.service';

describe('CreateVendorRateCardService', () => {
  let service: CreateVendorRateCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateVendorRateCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
