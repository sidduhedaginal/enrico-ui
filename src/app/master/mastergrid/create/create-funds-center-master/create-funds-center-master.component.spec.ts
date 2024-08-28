import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFundsCenterMasterComponent } from './create-funds-center-master.component';

describe('CreateFundsCenterMasterComponent', () => {
  let component: CreateFundsCenterMasterComponent;
  let fixture: ComponentFixture<CreateFundsCenterMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFundsCenterMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFundsCenterMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
