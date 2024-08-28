import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSuggestionComponent } from './vendor-suggestion.component';

describe('VendorSuggestionComponent', () => {
  let component: VendorSuggestionComponent;
  let fixture: ComponentFixture<VendorSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorSuggestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
