import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoriesCollectedDialogComponent } from './accessories-collected-dialog.component';

describe('AccessoriesCollectedDialogComponent', () => {
  let component: AccessoriesCollectedDialogComponent;
  let fixture: ComponentFixture<AccessoriesCollectedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoriesCollectedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessoriesCollectedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
