import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePMOConversionMasterComponent } from './create-pmoconversion-master.component';

describe('CreatePMOConversionMasterComponent', () => {
  let component: CreatePMOConversionMasterComponent;
  let fixture: ComponentFixture<CreatePMOConversionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePMOConversionMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePMOConversionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
