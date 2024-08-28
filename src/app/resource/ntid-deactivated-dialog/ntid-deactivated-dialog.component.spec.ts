import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NtidDeactivatedDialogComponent } from './ntid-deactivated-dialog.component';

describe('NtidDeactivatedDialogComponent', () => {
  let component: NtidDeactivatedDialogComponent;
  let fixture: ComponentFixture<NtidDeactivatedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NtidDeactivatedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NtidDeactivatedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
