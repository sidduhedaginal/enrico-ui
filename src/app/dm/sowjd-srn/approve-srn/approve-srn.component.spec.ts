import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSrnComponent } from './approve-srn.component';

describe('ApproveSrnComponent', () => {
  let component: ApproveSrnComponent;
  let fixture: ComponentFixture<ApproveSrnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveSrnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveSrnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
