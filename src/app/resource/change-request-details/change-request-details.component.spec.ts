import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestDetailsComponent } from './change-request-details.component';

describe('ChangeRequestDetailsComponent', () => {
  let component: ChangeRequestDetailsComponent;
  let fixture: ComponentFixture<ChangeRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
