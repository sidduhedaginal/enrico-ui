import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSectionSPOCMasterComponent } from './create-section-spocmaster.component';

describe('CreateSectionSPOCMasterComponent', () => {
  let component: CreateSectionSPOCMasterComponent;
  let fixture: ComponentFixture<CreateSectionSPOCMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSectionSPOCMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSectionSPOCMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
