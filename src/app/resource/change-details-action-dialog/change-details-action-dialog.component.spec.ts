import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDetailsActionDialogComponent } from './change-details-action-dialog.component';

describe('ChangeDetailsActionDialogComponent', () => {
  let component: ChangeDetailsActionDialogComponent;
  let fixture: ComponentFixture<ChangeDetailsActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeDetailsActionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeDetailsActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
