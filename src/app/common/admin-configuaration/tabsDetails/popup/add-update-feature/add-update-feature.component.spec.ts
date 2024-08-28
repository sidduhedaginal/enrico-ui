import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateFeatureComponent } from './add-update-feature.component';

describe('AddUpdateFeatureComponent', () => {
  let component: AddUpdateFeatureComponent;
  let fixture: ComponentFixture<AddUpdateFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
