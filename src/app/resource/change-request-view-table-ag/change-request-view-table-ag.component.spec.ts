import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestViewTableAgComponent } from './change-request-view-table-ag.component';

describe('ChangeRequestViewTableAgComponent', () => {
  let component: ChangeRequestViewTableAgComponent;
  let fixture: ComponentFixture<ChangeRequestViewTableAgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeRequestViewTableAgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeRequestViewTableAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
