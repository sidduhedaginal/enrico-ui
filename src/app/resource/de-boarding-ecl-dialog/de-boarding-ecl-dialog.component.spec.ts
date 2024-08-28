import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeBoardingEclDialogComponent } from './de-boarding-ecl-dialog.component';

describe('DeBoardingEclDialogComponent', () => {
  let component: DeBoardingEclDialogComponent;
  let fixture: ComponentFixture<DeBoardingEclDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeBoardingEclDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeBoardingEclDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
