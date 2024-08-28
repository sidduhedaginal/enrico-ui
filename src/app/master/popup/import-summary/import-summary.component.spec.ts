import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSummaryComponent } from './import-summary.component';

describe('ImportSummaryComponent', () => {
  let component: ImportSummaryComponent;
  let fixture: ComponentFixture<ImportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
