import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendbackSrnComponent } from './sendback-srn.component';

describe('SendbackSrnComponent', () => {
  let component: SendbackSrnComponent;
  let fixture: ComponentFixture<SendbackSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendbackSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendbackSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
