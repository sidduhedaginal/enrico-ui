import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebordingMoreActionDialogComponent } from './debording-more-action-dialog.component';

describe('DebordingMoreActionDialogComponent', () => {
  let component: DebordingMoreActionDialogComponent;
  let fixture: ComponentFixture<DebordingMoreActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebordingMoreActionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebordingMoreActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
