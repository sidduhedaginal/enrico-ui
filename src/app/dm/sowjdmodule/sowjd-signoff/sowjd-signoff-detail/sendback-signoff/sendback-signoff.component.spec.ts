import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendbackSignoffComponent } from './sendback-signoff.component';

describe('SendbackSignoffComponent', () => {
  let component: SendbackSignoffComponent;
  let fixture: ComponentFixture<SendbackSignoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendbackSignoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendbackSignoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
