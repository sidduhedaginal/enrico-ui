import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestDetailsViewActionComponent } from './change-request-details-view-action.component';

describe('ChangeRequestDetailsViewActionComponent', () => {
  let component: ChangeRequestDetailsViewActionComponent;
  let fixture: ComponentFixture<ChangeRequestDetailsViewActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDetailsViewActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestDetailsViewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
