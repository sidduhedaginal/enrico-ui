import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebordingViewTableAgComponent } from './debording-view-table-ag.component';

describe('DebordingViewTableAgComponent', () => {
  let component: DebordingViewTableAgComponent;
  let fixture: ComponentFixture<DebordingViewTableAgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebordingViewTableAgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebordingViewTableAgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
