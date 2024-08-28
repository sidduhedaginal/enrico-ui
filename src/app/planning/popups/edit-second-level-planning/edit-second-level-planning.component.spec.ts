import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSEcondLevelPlanningComponent } from './edit-second-level-planning.component';

describe('EditSEcondLevelPlanningComponent', () => {
  let component: EditSEcondLevelPlanningComponent;
  let fixture: ComponentFixture<EditSEcondLevelPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSEcondLevelPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSEcondLevelPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
