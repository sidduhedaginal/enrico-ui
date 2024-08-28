import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeBoardingRequestDetailsComponent } from './de-boarding-request-details.component';

describe('DeBoardingRequestDetailsComponent', () => {
  let component: DeBoardingRequestDetailsComponent;
  let fixture: ComponentFixture<DeBoardingRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeBoardingRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeBoardingRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
