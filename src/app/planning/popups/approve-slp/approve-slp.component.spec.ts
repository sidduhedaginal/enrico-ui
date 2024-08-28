import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveSLPComponent } from './approve-slp.component';

describe('ApproveSLPComponent', () => {
  let component: ApproveSLPComponent;
  let fixture: ComponentFixture<ApproveSLPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveSLPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveSLPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
