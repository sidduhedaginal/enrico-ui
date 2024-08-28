import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetainResourceDialogComponent } from './retain-resource-dialog.component';

describe('RetainResourceDialogComponent', () => {
  let component: RetainResourceDialogComponent;
  let fixture: ComponentFixture<RetainResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetainResourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetainResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
