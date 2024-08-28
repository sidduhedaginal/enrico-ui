import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendbackrfqComponent } from './sendbackrfq.component';

describe('SendbackrfqComponent', () => {
  let component: SendbackrfqComponent;
  let fixture: ComponentFixture<SendbackrfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendbackrfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendbackrfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
