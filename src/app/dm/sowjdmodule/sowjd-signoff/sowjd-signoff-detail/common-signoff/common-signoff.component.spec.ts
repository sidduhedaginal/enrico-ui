import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSignoffComponent } from './common-signoff.component';

describe('CommonSignoffComponent', () => {
  let component: CommonSignoffComponent;
  let fixture: ComponentFixture<CommonSignoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonSignoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonSignoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
