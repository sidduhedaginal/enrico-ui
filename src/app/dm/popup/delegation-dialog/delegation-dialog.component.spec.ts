import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelegationDialogComponent } from './delegation-dialog.component';

describe('DelegationDialogComponent', () => {
  let component: DelegationDialogComponent;
  let fixture: ComponentFixture<DelegationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DelegationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelegationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
