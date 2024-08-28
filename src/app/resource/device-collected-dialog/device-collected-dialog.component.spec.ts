import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCollectedDialogComponent } from './device-collected-dialog.component';

describe('DeviceCollectedDialogComponent', () => {
  let component: DeviceCollectedDialogComponent;
  let fixture: ComponentFixture<DeviceCollectedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceCollectedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceCollectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
