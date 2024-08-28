import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformPartnerDialogComponent } from './inform-partner-dialog.component';

describe('InformPartnerDialogComponent', () => {
  let component: InformPartnerDialogComponent;
  let fixture: ComponentFixture<InformPartnerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformPartnerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformPartnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
